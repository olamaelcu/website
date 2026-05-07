/**
 * ATProto DID profile fetching utilities.
 * Uses the Bluesky public API to fetch profile information.
 */

export interface Profile {
	did: string;
	handle: string;
	displayName?: string;
	avatarUrl?: string | null;
}

interface BskyProfileResponse {
	did: string;
	handle: string;
	displayName?: string;
	description?: string;
	avatar?: string;
	banner?: string;
}

/**
 * Fetch complete profile information for a DID using the Bluesky public API
 */
export async function fetchProfile(did: string): Promise<Profile> {
	const response = await fetch(
		`https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(did)}`
	);

	if (!response.ok) {
		throw new Error(`Failed to fetch profile for ${did}: ${response.status}`);
	}

	const data: BskyProfileResponse = await response.json();

	return {
		did: data.did,
		handle: data.handle,
		displayName: data.displayName,
		avatarUrl: data.avatar || null
	};
}
