import { dev } from '$app/environment';

let initialized = false;

export async function initPlausible() {
	if (dev || initialized) return;
	initialized = true;
	const { init } = await import('@plausible-analytics/tracker');
	init({
		domain: import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN
	});
}
