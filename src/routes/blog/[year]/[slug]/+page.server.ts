import { getAllPostsAsync, getPostAsync } from '$lib/posts';
import { error } from '@sveltejs/kit';

export const prerender = true;

export async function entries() {
	const posts = await getAllPostsAsync();
	return posts.map((p) => ({ year: p.year, slug: p.slug }));
}

export async function load({ params, url }) {
	const post = await getPostAsync(params.year, params.slug);
	if (!post) throw error(404);

	const origin = url.origin;
	const canonicalUrl = `${origin}/blog/${post.year}/${post.slug}`;
	const ogImageUrl = `${origin}/blog-og/${post.slug}.png`;

	return {
		post,
		metaTags: {
			title: `${post.title} — Olamaelcu`,
			description: post.description,
			canonical: canonicalUrl,
			ogImage: ogImageUrl,
			twitterCard: 'summary_large_image',
			twitterImage: ogImageUrl
		}
	};
}
