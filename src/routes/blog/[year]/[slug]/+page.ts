import { getAllPostsAsync, getPostAsync } from '$lib/posts';
import { error } from '@sveltejs/kit';

export const prerender = true;

export async function entries() {
	const posts = await getAllPostsAsync();
	return posts.map((p) => ({ year: p.year, slug: p.slug }));
}

export async function load({ params }) {
	const post = await getPostAsync(params.year, params.slug);
	if (!post) throw error(404);
	return { post };
}
