import { getStackEntries } from '$lib/server/db/stack';
import { getRepositories } from '$lib/server/atproto';

export const prerender = false;

export const load = async () => {
	const entries = await getStackEntries();
	const repositories = await getRepositories();

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
