import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({ style: true, script: true })],
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				if (path === '/access/') return;
				throw new Error(message);
			}
		},

		experimental: {
			tracing: {
				server: true
			},

			instrumentation: {
				server: true
			}
		},

		csp: {
			mode: 'auto',
			directives: {
				'default-src': ["'self'"],
				'script-src': ["'self'", 'https://plausible.io'],
				'style-src': ["'self'", "'unsafe-inline'"],
				'img-src': ['self', 'data:', 'https://cdn.bsky.app', 'https://avatar-cdn.bsky.app'],
				'font-src': ["'self'"],
				'connect-src': [
					'self',
					'https://o428404.ingest.us.sentry.io',
					'https://public.api.bsky.app',
					'https://plausible.io',
					'https://ka-f.fontawesome.com'
				],
				'worker-src': ["'self'", 'blob:'],
				'frame-ancestors': ["'none'"],
				'base-uri': ["'self'"],
				'form-action': ["'self'"]
			}
		}
	}
};

export default config;
