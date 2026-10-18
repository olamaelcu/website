import { getStackEntries } from '$lib/server/db/stack';
import { getRepositories } from '$lib/server/atproto';

export const prerender = true;

export const load = async () => {
	// This runs at build time for the static export. If the database or the
	// ATProto forge is unreachable, degrade to an empty section rather than
	// failing the whole build.
	let entries: Awaited<ReturnType<typeof getStackEntries>> = [];
	try {
		entries = await getStackEntries();
	} catch (err) {
		console.warn('[stack] Failed to load stack entries:', err);
	}

	let repositories: Awaited<ReturnType<typeof getRepositories>> = [];
	try {
		repositories = await getRepositories();
	} catch (err) {
		console.warn('[stack] Failed to load repositories:', err);
	}

	// Group entries by category
	const categories = entries.reduce(
		(acc, entry) => {
			if (!acc[entry.category]) {
				acc[entry.category] = [];
			}
			acc[entry.category].push({
				name: entry.name,
				url: entry.url,
				domain: entry.domain,
				description: entry.description
			});
			return acc;
		},
		{} as Record<string, Array<{ name: string; url: string; domain: string; description: string }>>
	);

	return { categories, repositories };
};
