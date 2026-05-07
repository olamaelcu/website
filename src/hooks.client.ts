import { handleErrorWithSentry, replayIntegration } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://6e264aa61624cd0a755f5597490ac0f5@o428404.ingest.us.sentry.io/4511333848645632',

	tracesSampleRate: 1.0,

	enableLogs: true,

	replaysSessionSampleRate: 0.1,

	replaysOnErrorSampleRate: 1.0,

	integrations: [replayIntegration()],

	sendDefaultPii: true
});

export const handleError = handleErrorWithSentry();
