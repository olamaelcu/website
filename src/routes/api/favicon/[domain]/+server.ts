import { error } from '@sveltejs/kit';

const DUCKDUCKGO_ICON_URL = 'https://icons.duckduckgo.com/ip3';

const faviconCache = new Map<
	string,
	{ data: Uint8Array; contentType: string; timestamp: number }
>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function GET({ params }) {
	const { domain } = params;

	if (!domain || domain.includes('..') || domain.includes('/')) {
		throw error(400, 'Invalid domain');
	}

	const cacheKey = domain;
	const cached = faviconCache.get(cacheKey);

	if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
		return new Response(Buffer.from(cached.data), {
			headers: {
				'Content-Type': cached.contentType,
				'Cache-Control': 'public, max-age=86400'
			}
		});
	}

	try {
		const response = await fetch(`${DUCKDUCKGO_ICON_URL}/${domain}.ico`);

		if (!response.ok) {
			// Return a transparent 1x1 PNG as fallback
			const fallback = new Uint8Array([
				0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44,
				0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00, 0x00, 0x1f,
				0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00,
				0x01, 0x00, 0x00, 0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
				0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
			]);

			return new Response(Buffer.from(fallback), {
				headers: {
					'Content-Type': 'image/png',
					'Cache-Control': 'public, max-age=3600'
				}
			});
		}

		const data = new Uint8Array(await response.arrayBuffer());
		const contentType = response.headers.get('content-type') || 'image/x-icon';

		faviconCache.set(cacheKey, { data, contentType, timestamp: Date.now() });

		// Prune cache if it gets too large
		if (faviconCache.size > 1000) {
			const oldest = [...faviconCache.entries()]
				.sort((a, b) => a[1].timestamp - b[1].timestamp)
				.slice(0, 200);
			oldest.forEach(([key]) => faviconCache.delete(key));
		}

		return new Response(Buffer.from(data), {
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=86400'
			}
		});
	} catch {
		throw error(502, 'Failed to fetch favicon');
	}
}
