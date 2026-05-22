/**
 * Constants for Standard.site integration
 */

// Site DID (publication identity)
export const DID = 'did:plc:ejggqolmgpylroktvaktibik';

// Record keys
export const PUBLICATION_RKEY = 'olamaelcu-publication';

// Collections
export const COLLECTION_PUB = 'site.standard.publication';
export const COLLECTION_DOC = 'site.standard.document';

/**
 * Returns the AT URI for the publication record
 */
export function publicationAtUri(): string {
	return `at://${DID}/${COLLECTION_PUB}/${PUBLICATION_RKEY}`;
}

/**
 * Returns the AT URI for a document record
 * @param rkey - The record key
 */
export function documentAtUri(rkey: string): string {
	return `at://${DID}/${COLLECTION_DOC}/${rkey}`;
}

/**
 * Generates a record key for a document based on year and slug
 * @param year - The year of the post
 * @param slug - The slug of the post
 */
export function documentRkey(year: string, slug: string): string {
	return `${year}-${slug}`;
}
