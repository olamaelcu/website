/**
 * TypeScript interfaces matching the Standard.site lexicon
 * @see https://github.com/bluesky-social/social-app
 */

export interface BlobRef {
	$type: 'blob';
	ref: {
		$link: string;
	};
	mimeType: string;
	size: number;
}

export interface StrongRef {
	uri: string;
	cid: string;
}

export interface Contributor {
	did: string;
	role?: string;
	displayName?: string;
}

export interface SiteStandardPublication {
	$type: 'site.standard.publication';
	url: string;
	name: string;
	description: string;
	icon: BlobRef;
}

export interface SiteStandardDocument {
	$type: 'site.standard.document';
	site: string;
	title: string;
	publishedAt: string;
	path: string;
	description: string;
	coverImage?: BlobRef;
	textContent: string;
	bskyPostRef?: StrongRef;
	tags: string[];
	contributors: Contributor[];
}
