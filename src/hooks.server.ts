import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
	event.setHeaders({
		'X-Content-Type-Options': 'nosniff',
		'X-XSS-Protection': '1; mode=block',
		'Referrer-Policy': 'strict-origin-when-cross-origin',
		'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
	});
	return resolve(event);
});

export const handleError = Sentry.handleErrorWithSentry();
