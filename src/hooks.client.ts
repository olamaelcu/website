import { dev } from '$app/environment';

export const plausibleReady = (async () => {
	if (dev) return;
	const { init } = await import('@plausible-analytics/tracker');
	init({
		domain: import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN
	});
})();

plausibleReady;
