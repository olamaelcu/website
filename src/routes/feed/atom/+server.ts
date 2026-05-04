import { generateAtomFeed } from '$lib/feed';
import { SITE_URL } from '$lib/constants';

export const prerender = true;

export async function GET() {
	const feed = await generateAtomFeed(SITE_URL);

	return new Response(feed, {
		headers: {
			'Content-Type': 'application/atom+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
