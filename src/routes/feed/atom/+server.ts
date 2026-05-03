import { generateAtomFeed } from '$lib/feed';

export const prerender = true;

export async function GET({ url }) {
	const origin = url.origin;
	const feed = await generateAtomFeed(origin);

	return new Response(feed, {
		headers: {
			'Content-Type': 'application/atom+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
