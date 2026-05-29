import { getPostAsync } from '$lib/posts';
import { SITE_URL } from '$lib/constants';
import { error } from '@sveltejs/kit';
import { fetchWebmentions } from '$lib/webmentions';

export const load: import('./$types').PageServerLoad = async ({ params }) => {
	const post = await getPostAsync(params.year, params.slug);
	if (!post) throw error(404);

	const canonicalUrl = `${SITE_URL}/blog/${post.year}/${post.slug}`;
	const ogImageUrl = `${SITE_URL}/blog-og/${post.year}-${post.slug}.png`;

	const webmentions = await fetchWebmentions(canonicalUrl);

	return {
		post,
		webmentions,
		metaTags: {
			title: `${post.title} — Olamaelcu`,
			description: post.description,
			canonical: canonicalUrl,
			ogImage: ogImageUrl,
			twitterCard: 'summary_large_image',
			twitterImage: ogImageUrl
		}
	};
};
