import { text } from '@sveltejs/kit';
import { publicationAtUri } from '$lib/standard-site/constants';

export const prerender = true;

/**
 * Standard.site well-known endpoint
 * Returns the AT URI for the site's publication record
 */
export function GET() {
	return text(publicationAtUri());
}
