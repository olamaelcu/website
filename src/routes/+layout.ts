import { browser } from '$app/environment';
import { QueryClient } from '@tanstack/svelte-query';
import { COMMIT } from '$lib/commit';

export const prerender = false;

export async function load() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: 1000 * 60,
				refetchOnWindowFocus: false
			}
		}
	});

	return {
		queryClient,
		commit: COMMIT ?? process.env.COMMIT
	};
}
