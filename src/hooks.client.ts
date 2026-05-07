import { handleErrorWithSentry, replayIntegration } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://3154c37a9dc2b19b6f4e7ae18457593a@o428404.ingest.us.sentry.io/4511345977327616',

	tracesSampleRate: 1.0,

	enableLogs: true,

	replaysSessionSampleRate: 0.1,

	replaysOnErrorSampleRate: 1.0,

	integrations: [replayIntegration()],

	sendDefaultPii: true
});

export const handleError = handleErrorWithSentry();
