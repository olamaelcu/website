import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: 'https://6e264aa61624cd0a755f5597490ac0f5@o428404.ingest.us.sentry.io/4511333848645632',

	tracesSampleRate: 1.0,

	enableLogs: true
});
