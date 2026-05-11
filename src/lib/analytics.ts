import { onMount } from 'svelte';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';

let initialized = false;

export function initPlausible() {
	if (!browser) return;
	if (initialized) return;

	onMount(async () => {
		if (!browser) return;
		if (initialized) return;

		const domain = env.PUBLIC_PLAUSIBLE_DOMAIN;
		if (!domain) {
			console.warn('PUBLIC_PLAUSIBLE_DOMAIN not set, skipping Plausible init');
			return;
		}

		const { init } = await import('@plausible-analytics/tracker');
		init({ domain });
		initialized = true;
	});
}

export function trackEvent(eventName: string, props?: Record<string, unknown>) {
	if (!browser) return;

	// Use window.plausible if available (set by bindToWindow: true)
	if (typeof window !== 'undefined' && (window as any).plausible) {
		(window as any).plausible(eventName, { props });
	}
}
