import { describe, it, expect } from 'vitest';

describe('GET /health', () => {
	const HEALTH_URL = '/health';

	// Use unique IP headers to get isolated rate limit windows per test
	const makeRequest = (ip: string) =>
		fetch(HEALTH_URL, {
			headers: {
				'x-forwarded-for': ip
			}
		});

	describe('returns healthy status', () => {
		it('returns 200 with { status: "ok" }', async () => {
			const res = await makeRequest('192.168.1.100');
			const body = await res.json();

			expect(res.status).toBe(200);
			expect(body).toEqual({ status: 'ok' });
		});
	});

	describe('returns correct content-type', () => {
		it('sets Content-Type to application/json', async () => {
			const res = await makeRequest('192.168.1.101');

			expect(res.headers.get('content-type')).toContain('application/json');
		});
	});

	describe('rate limit headers', () => {
		it('includes X-RateLimit headers on successful requests', async () => {
			const res = await makeRequest('192.168.1.102');

			expect(res.headers.has('X-RateLimit-Limit')).toBe(true);
			expect(res.headers.has('X-RateLimit-Remaining')).toBe(true);
			expect(res.headers.has('X-RateLimit-Reset')).toBe(true);
		});

		it('reports correct limit of 100 requests per minute', async () => {
			const res = await makeRequest('192.168.1.103');

			expect(res.headers.get('X-RateLimit-Limit')).toBe('100');
		});
	});

	describe('handles multiple rapid requests within rate limit', () => {
		it('succeeds for multiple requests under the limit', async () => {
			const ip = '192.168.1.200';
			const numRequests = 10;

			const results = await Promise.all(Array.from({ length: numRequests }, () => makeRequest(ip)));

			// All requests should succeed
			for (const res of results) {
				expect(res.status).toBe(200);
			}

			// Remaining should reflect the requests made
			const lastRes = results[results.length - 1];
			const remaining = parseInt(lastRes.headers.get('X-RateLimit-Remaining') ?? '0', 10);
			expect(remaining).toBe(100 - numRequests);
		});
	});

	describe('rate limit enforcement', () => {
		it('returns 429 when rate limit is exceeded', async () => {
			const ip = '192.168.1.250';

			// Exhaust the rate limit (100 requests)
			const requests = await Promise.all(Array.from({ length: 100 }, () => makeRequest(ip)));

			// All initial requests should succeed
			for (const res of requests) {
				expect(res.status).toBe(200);
			}

			// The 101st request should be rate limited
			const res = await makeRequest(ip);
			expect(res.status).toBe(429);

			const body = await res.json();
			expect(body).toHaveProperty('error');
			expect(res.headers.get('Retry-After')).toBeTruthy();
		});

		it('includes rate limit headers on 429 response', async () => {
			const ip = '192.168.1.251';

			// Exhaust the rate limit
			await Promise.all(Array.from({ length: 100 }, () => makeRequest(ip)));

			const res = await makeRequest(ip);

			expect(res.status).toBe(429);
			expect(res.headers.get('X-RateLimit-Limit')).toBe('100');
			expect(res.headers.get('X-RateLimit-Remaining')).toBe('0');
		});
	});
});
