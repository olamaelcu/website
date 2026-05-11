import { dev } from '$app/environment';
import { PUBLIC_PLAUSIBLE_DOMAIN } from '$env/static/public';

let initialized = false;

export function initPlausible() {
	if (dev || initialized) return;
	initialized = true;
	import('@plausible-analytics/tracker').then(({ init }) => {
		init({
			domain: PUBLIC_PLAUSIBLE_DOMAIN
		});
	});
}
