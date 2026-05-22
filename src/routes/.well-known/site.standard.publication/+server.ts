import { text } from '@sveltejs/kit';
import { publicationAtUri } from '$lib/standard-site/constants';

/**
 * Standard.site well-known endpoint
 * Returns the AT URI for the site's publication record
 */
export function GET() {
	return text(publicationAtUri());
}
