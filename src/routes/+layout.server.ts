import { COMMIT } from '$lib/commit';

interface PageMetaTags {
	title?: string;
	description?: string;
	canonical?: string;
	ogImage?: string;
	twitterCard?: string;
	twitterImage?: string;
}

export const load = () => {
	return {
		commit: COMMIT ?? process.env.COMMIT,
		metaTags: {} as PageMetaTags
	};
};
