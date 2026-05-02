import { getAllPostsAsync } from '$lib/posts';

export const prerender = true;

export async function entries(): Promise<Array<{ year?: string }>> {
	return [{}];
}

export async function load() {
	const posts = await getAllPostsAsync();
	return { posts };
}
