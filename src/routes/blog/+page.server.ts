import { getAllPostsAsync } from '$lib/posts';
import { SITE_URL } from '$lib/constants';

export const prerender = true;

export async function entries(): Promise<Array<{ year?: string }>> {
	return [{}];
}

export async function load() {
	const posts = await getAllPostsAsync();

	return {
		posts,
		atomFeed: `${SITE_URL}/feed/atom`,
		jsonFeed: `${SITE_URL}/feed/json`
	};
}
