import { dev } from '$app/environment';

async function initPlausible() {
	if (dev) return;
	const { init } = await import('@plausible-analytics/tracker');
	init({
		domain: import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN
	});
}
initPlausible();
