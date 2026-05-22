import { Agent } from '@atproto/api';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getAllPostsAsync } from '$lib/posts';
import type { Post } from '$lib/posts';
import type { SiteStandardPublication, SiteStandardDocument, BlobRef, StrongRef } from './types';
import {
	DID,
	PUBLICATION_RKEY,
	COLLECTION_PUB,
	COLLECTION_DOC,
	documentRkey,
	publicationAtUri
} from './constants';

// Initialize AT Protocol agent
const pdsHost = process.env.ATP_PDS_HOST;
const authToken = process.env.ATP_AUTH_TOKEN;

console.log('[Standard.site] Initializing emitter module...');
console.log(`[Standard.site] ATP_PDS_HOST: ${pdsHost ? 'set (' + pdsHost + ')' : 'NOT SET'}`);
console.log(
	`[Standard.site] ATP_AUTH_TOKEN: ${authToken ? 'set (length: ' + authToken.length + ')' : 'NOT SET'}`
);

if (!pdsHost || !authToken) {
	console.warn(
		'[Standard.site] ATP_PDS_HOST or ATP_AUTH_TOKEN not set, Standard.site sync will not function'
	);
}

// Handle PDS host - may or may not include protocol
const agentUrl = pdsHost
	? pdsHost.startsWith('http://') || pdsHost.startsWith('https://')
		? pdsHost
		: `https://${pdsHost}`
	: '';
console.log(`[Standard.site] Agent URL: ${agentUrl || 'NOT CONFIGURED'}`);
const agent = new Agent(agentUrl);

/**
 * Sets up authentication for the agent
 */
function setupAuth(): void {
	if (!authToken) {
		throw new Error('ATP_AUTH_TOKEN environment variable is required');
	}
	// The agent uses the auth token for authenticated requests
	agent.api.setHeader('Authorization', `Bearer ${authToken}`);
	console.log('[Standard.site] Authentication set up successfully');
}

/**
 * Uploads a blob to the PDS
 * @param data - The binary data to upload
 * @param mimeType - The MIME type of the blob
 * @returns The BlobRef for the uploaded blob
 */
export async function uploadBlob(data: Buffer, mimeType: string): Promise<BlobRef> {
	console.log(`[Standard.site] Uploading blob (${data.length} bytes, ${mimeType})...`);
	setupAuth();
	const response = await agent.uploadBlob(data, { encoding: mimeType });
	const blobRef = {
		$type: 'blob' as const,
		ref: {
			$link: response.data.blob.ref.toString()
		},
		mimeType,
		size: data.length
	};
	console.log(`[Standard.site] Blob uploaded successfully: ${blobRef.ref.$link}`);
	return blobRef;
}

/**
 * Resolves a URI to get the CID for a StrongRef
 * @param uri - The AT URI to resolve
 * @returns The StrongRef with URI and CID
 */
export async function resolveCid(uri: string): Promise<StrongRef> {
	console.log(`[Standard.site] Resolving CID for URI: ${uri}`);
	setupAuth();
	const parts = uri.replace('at://', '').split('/');
	const repo = parts[0];
	const collection = parts[1];
	const rkey = parts[2];

	console.log(
		`[Standard.site] Fetching record: repo=${repo}, collection=${collection}, rkey=${rkey}`
	);
	const response = await agent.com.atproto.repo.getRecord({
		repo,
		collection,
		rkey
	});

	if (!response.data.cid) {
		throw new Error(`Could not resolve CID for ${uri}`);
	}

	console.log(`[Standard.site] CID resolved: ${response.data.cid}`);
	return {
		uri,
		cid: response.data.cid
	};
}

/**
 * Strips HTML tags from content and replaces with newlines
 * @param html - The HTML content
 * @returns Plain text content
 */
function stripHtml(html: string): string {
	return html
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/<p[^>]*>/gi, '\n')
		.replace(/<\/p>/gi, '')
		.replace(/<[^>]+>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

/**
 * Synchronizes the publication record to the PDS
 */
export async function syncPublication(): Promise<void> {
	console.log('[Standard.site] Starting publication sync...');
	console.log(`[Standard.site] Publication rkey: ${PUBLICATION_RKEY}`);
	console.log(`[Standard.site] Publication DID: ${DID}`);
	setupAuth();

	// Read and upload favicon
	const faviconPath = join(process.cwd(), 'static', 'favicon.png');
	console.log(`[Standard.site] Reading favicon from: ${faviconPath}`);
	const faviconData = readFileSync(faviconPath);
	console.log(`[Standard.site] Favicon size: ${faviconData.length} bytes`);

	const iconBlob = await uploadBlob(faviconData, 'image/png');

	const publication: SiteStandardPublication = {
		$type: 'site.standard.publication',
		url: 'https://olamaelcu.net',
		name: 'Olamaelcu',
		description: 'A little software lab.',
		icon: iconBlob
	};

	console.log('[Standard.site] Sending publication record to PDS...');
	console.log(`[Standard.site] Publication URL: ${publication.url}`);
	console.log(`[Standard.site] Publication name: ${publication.name}`);

	await agent.com.atproto.repo.putRecord({
		repo: DID,
		collection: COLLECTION_PUB,
		rkey: PUBLICATION_RKEY,
		record: publication as unknown as Record<string, unknown>
	});

	console.log('[Standard.site] Publication synced successfully:', publicationAtUri());
}

/**
 * Synchronizes a single document (blog post) to the PDS
 * @param post - The post to sync
 */
export async function syncDocument(post: Post): Promise<void> {
	const rkey = documentRkey(post.year, post.slug);
	console.log(`[Standard.site] Starting document sync for: ${rkey}`);
	console.log(`[Standard.site] Post title: ${post.title}`);
	console.log(`[Standard.site] Post date: ${post.date}`);
	console.log(`[Standard.site] Post has ${post.authors?.length || 0} author(s)`);
	console.log(`[Standard.site] Post has ${post.tags?.length || 0} tag(s)`);
	console.log(`[Standard.site] bskyPostUri: ${post.bskyPostUri || 'none'}`);

	setupAuth();

	// Read and upload OG image
	const ogImagePath = join(process.cwd(), 'static', 'blog-og', `${rkey}.png`);
	console.log(`[Standard.site] Looking for OG image at: ${ogImagePath}`);

	let coverImageBlob: BlobRef | undefined;
	try {
		const ogImageData = readFileSync(ogImagePath);
		console.log(`[Standard.site] OG image found: ${ogImageData.length} bytes`);
		coverImageBlob = await uploadBlob(ogImageData, 'image/png');
	} catch (err) {
		console.warn(`[Standard.site] No OG image found for ${rkey}, skipping coverImage`);
	}

	// Resolve bskyPostRef if available
	let bskyPostRef: StrongRef | undefined;
	if (post.bskyPostUri) {
		console.log(`[Standard.site] Resolving bskyPostRef for: ${post.bskyPostUri}`);
		try {
			bskyPostRef = await resolveCid(post.bskyPostUri);
			console.log(`[Standard.site] bskyPostRef resolved: ${bskyPostRef.cid}`);
		} catch (err) {
			console.warn(`[Standard.site] Could not resolve bskyPostUri for ${rkey}:`, err);
		}
	} else {
		console.log(`[Standard.site] No bskyPostUri for this post`);
	}

	// Map authors to contributors
	const contributors =
		post.authors?.map((author) => ({
			did: author.did,
			displayName: author.name,
			role: 'author'
		})) ?? [];
	console.log(`[Standard.site] Mapped ${contributors.length} contributor(s)`);

	// Strip HTML from content for textContent
	const textContent = stripHtml(post.content);
	console.log(`[Standard.site] Stripped HTML content: ${textContent.length} characters`);

	// Build the path
	const path = `/blog/${post.year}/${post.slug}`;
	console.log(`[Standard.site] Document path: ${path}`);

	const document: SiteStandardDocument = {
		$type: 'site.standard.document',
		site: publicationAtUri(),
		title: post.title,
		publishedAt: new Date(post.date).toISOString(),
		path,
		description: post.description,
		...(coverImageBlob && { coverImage: coverImageBlob }),
		textContent,
		...(bskyPostRef && { bskyPostRef }),
		tags: post.tags,
		contributors
	};

	console.log(`[Standard.site] Sending document record to PDS (rkey: ${rkey})...`);
	await agent.com.atproto.repo.putRecord({
		repo: DID,
		collection: COLLECTION_DOC,
		rkey,
		record: document as unknown as Record<string, unknown>
	});

	console.log(`[Standard.site] Document synced successfully: ${rkey}`);
}

/**
 * Synchronizes all posts and the publication to the PDS
 * Throws on any failure (fail loudly)
 */
export async function syncAll(): Promise<void> {
	console.log('');
	console.log('========================================');
	console.log('[Standard.site] STARTING SYNC PROCESS');
	console.log('========================================');
	console.log(`[Standard.site] Timestamp: ${new Date().toISOString()}`);
	console.log(`[Standard.site] PDS Host: ${pdsHost}`);
	console.log(`[Standard.site] Publication DID: ${DID}`);
	console.log(`[Standard.site] Publication rkey: ${PUBLICATION_RKEY}`);

	// Sync publication first
	console.log('');
	console.log('[Standard.site] Step 1: Syncing publication...');
	await syncPublication();

	// Get all posts
	console.log('');
	console.log('[Standard.site] Step 2: Loading posts...');
	const posts = await getAllPostsAsync();
	console.log(`[Standard.site] Found ${posts.length} total post(s)`);

	// Sync each non-draft post
	console.log('');
	console.log('[Standard.site] Step 3: Syncing documents...');
	let syncedCount = 0;
	let skippedCount = 0;

	for (const post of posts) {
		if (post.draft) {
			console.log(`[Standard.site] Skipping draft post: ${post.year}-${post.slug}`);
			skippedCount++;
			continue;
		}
		await syncDocument(post);
		syncedCount++;
	}

	console.log('');
	console.log('========================================');
	console.log('[Standard.site] SYNC COMPLETED SUCCESSFULLY');
	console.log('========================================');
	console.log(`[Standard.site] Total posts: ${posts.length}`);
	console.log(`[Standard.site] Synced: ${syncedCount}`);
	console.log(`[Standard.site] Skipped (drafts): ${skippedCount}`);
	console.log(`[Standard.site] Publication URI: ${publicationAtUri()}`);
	console.log('');
}
