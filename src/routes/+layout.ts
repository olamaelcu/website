import { QueryClient } from '@tanstack/svelte-query';
import { browser } from '$app/environment';

// Create a QueryClient with the same defaults as @olamaelcu/atproto-svelte
// This mirrors the identityClient configuration from the package
const identityClient = new QueryClient({
	defaultOptions: {
		queries: {
			enabled: browser,
			staleTime: 1000 * 60 * 10, // 10 minutes
			gcTime: 1000 * 60 * 60, // 1 hour
			refetchOnWindowFocus: false,
			retry: 2,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000)
		}
	}
});

export const prerender = false;

export function load() {
	return {
		// Alias identityClient as queryClient for QueryClientProvider compatibility
		queryClient: identityClient
	};
}
