import { generateJsonFeed } from '$lib/feed';

export const prerender = true;

export async function GET({ url }) {
	const origin = url.origin;
	const feed = await generateJsonFeed(origin);

	return new Response(feed, {
		headers: {
			'Content-Type': 'application/feed+json; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
