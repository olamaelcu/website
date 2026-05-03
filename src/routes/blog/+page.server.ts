import { getAllPostsAsync } from '$lib/posts';

export const prerender = true;

export async function entries(): Promise<Array<{ year?: string }>> {
	return [{}];
}

export async function load({ url }) {
	const posts = await getAllPostsAsync();
	const origin = url.origin;

	return {
		posts,
		atomFeed: `${origin}/feed/atom`,
		jsonFeed: `${origin}/feed/json`
	};
}
