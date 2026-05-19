interface RepoRecord {
	uri: string;
	cid: string;
	value: {
		name: string;
		description: string;
		topics: string[];
		repoDid: string;
		createdAt: string;
	};
}

export interface Repo {
	name: string;
	description: string;
	topics: string[];
	knot: string;
	starCount: number;
	forgeUrl: string;
	createdAt: string;
}

// In-memory cache with 5-minute TTL
let cache: { data: Repo[] | null; timestamp: number } = {
	data: null,
	timestamp: 0
};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const PDS_URL = 'https://blacksky.app/xrpc/com.atproto.repo.listRecords';
const CONSTELLATION_URL = 'https://constellation.microcosm.blue/links/count';
const USER_AGENT = 'olamaelcu.net/1.0 (stack-page; olamaelcu@olamaelcu.net)';

export async function getRepositories(): Promise<Repo[]> {
	// Check cache first
	const now = Date.now();
	if (cache.data && now - cache.timestamp < CACHE_TTL) {
		return cache.data;
	}

	// Fetch repo list from PDS
	const pdsResponse = await fetch(
		`${PDS_URL}?repo=did:plc:ejggqolmgpylroktvaktibik&collection=sh.tangled.repo`,
		{
			headers: {
				'User-Agent': USER_AGENT
			}
		}
	);

	if (!pdsResponse.ok) {
		// If fetch fails but we have stale cache, return it
		if (cache.data) {
			return cache.data;
		}
		throw new Error(`Failed to fetch repos: ${pdsResponse.status}`);
	}

	const pdsData = await pdsResponse.json();
	const records: RepoRecord[] = pdsData.records ?? [];

	// Fetch star counts for each repo
	const reposWithStars: Repo[] = await Promise.all(
		records.map(async (record) => {
			const repoDid = record.value.repoDid;
			let starCount = 0;

			if (repoDid) {
				try {
					const starResponse = await fetch(
						`${CONSTELLATION_URL}?target=${encodeURIComponent(repoDid)}&collection=sh.tangled.feed.star&path=.subject.did`,
						{
							headers: {
								'User-Agent': USER_AGENT
							}
						}
					);

					if (starResponse.ok) {
						const starData = await starResponse.json();
						starCount = starData.count ?? 0;
					}
				} catch {
					// If star fetch fails, default to 0
					starCount = 0;
				}
			}

			return {
				name: record.value.name,
				description: record.value.description,
				topics: record.value.topics ?? [],
				knot: repoDid,
				starCount,
				forgeUrl: `https://forge.blacksky.community/olamaelcu.net/${record.value.name}`,
				createdAt: record.value.createdAt
			};
		})
	);

	// Update cache
	cache = {
		data: reposWithStars,
		timestamp: now
	};

	return reposWithStars;
}
