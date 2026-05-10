// ---------------------------------------------------------------------------
// In-memory sliding-window rate limiter (dependency-free)
// ---------------------------------------------------------------------------
type RateLimitEntry = { count: number; resetTime: number };

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 5 * 60_000; // every 5 minutes
const MAX_RATE_LIMIT_STORE_SIZE = 50_000;

const rateLimitStore = new Map<string, RateLimitEntry>();

/** Determine the client IP from the request. */
function getClientIp(event: import('@sveltejs/kit').RequestEvent): string {
	const forwarded = event.request.headers.get('x-forwarded-for');
	if (forwarded) {
		// X-Forwarded-For: client, proxy1, proxy2 — take the first (leftmost) value
		const firstIp = forwarded.split(',')[0]?.trim();
		if (firstIp) return firstIp;
	}
	return event.getClientAddress();
}

/** Check (and increment) the rate limit for a given key. */
function checkRateLimit(ip: string): {
	allowed: boolean;
	limit: number;
	remaining: number;
	resetTime: number;
} {
	const now = Date.now();
	const entry = rateLimitStore.get(ip);

	// No entry or window expired — start fresh
	if (!entry || now >= entry.resetTime) {
		// Evict oldest entries if store is too large
		if (rateLimitStore.size >= MAX_RATE_LIMIT_STORE_SIZE) {
			let oldest: string | null = null;
			let oldestTime = Infinity;
			for (const [ip, e] of rateLimitStore) {
				if (e.resetTime < oldestTime) {
					oldest = ip;
					oldestTime = e.resetTime;
				}
			}
			if (oldest) rateLimitStore.delete(oldest);
		}
		const resetTime = now + RATE_LIMIT_WINDOW_MS;
		rateLimitStore.set(ip, { count: 1, resetTime });
		return {
			allowed: true,
			limit: RATE_LIMIT_MAX_REQUESTS,
			remaining: RATE_LIMIT_MAX_REQUESTS - 1,
			resetTime
		};
	}

	// Within the current window
	entry.count += 1;
	const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count);
	return {
		allowed: entry.count <= RATE_LIMIT_MAX_REQUESTS,
		limit: RATE_LIMIT_MAX_REQUESTS,
		remaining,
		resetTime: entry.resetTime
	};
}

/** Remove expired entries to prevent unbounded memory growth. */
function cleanupExpiredEntries(): void {
	const now = Date.now();
	for (const [ip, entry] of rateLimitStore) {
		if (now >= entry.resetTime) {
			rateLimitStore.delete(ip);
		}
	}
}

const cleanupTimer = setInterval(cleanupExpiredEntries, RATE_LIMIT_CLEANUP_INTERVAL_MS);
// Allow the process to exit even if the timer is still running
if (cleanupTimer.unref) cleanupTimer.unref();

// ---------------------------------------------------------------------------
// SvelteKit hooks
// ---------------------------------------------------------------------------
import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import type { Handle } from '@sveltejs/kit';

const rateLimiter: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	// Only rate-limit API and health routes
	if (pathname.startsWith('/api/') || pathname === '/health') {
		const ip = getClientIp(event);
		const result = checkRateLimit(ip);

		// Always attach rate-limit headers so well-behaved clients can self-throttle
		const rateLimitHeaders: Record<string, string> = {
			'X-RateLimit-Limit': String(result.limit),
			'X-RateLimit-Remaining': String(result.remaining),
			'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)) // Unix seconds
		};

		if (!result.allowed) {
			const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
			return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': String(retryAfter),
					...rateLimitHeaders
				}
			});
		}

		// Attach headers to the downstream response
		event.setHeaders(rateLimitHeaders);
	}

	return resolve(event);
};

export const handle: Handle = sequence(
	Sentry.sentryHandle(),
	rateLimiter,
	async ({ event, resolve }) => {
		event.setHeaders({
			'X-Content-Type-Options': 'nosniff',
			'X-XSS-Protection': '1; mode=block',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
			'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
			'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
		});
		return resolve(event);
	}
);

export const handleError = Sentry.handleErrorWithSentry();
