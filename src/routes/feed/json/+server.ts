import { generateJsonFeed } from '$lib/feed';
import { SITE_URL } from '$lib/constants';

export const prerender = true;

export async function GET() {
	const feed = await generateJsonFeed(SITE_URL);

	return new Response(feed, {
		headers: {
			'Content-Type': 'application/feed+json; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
