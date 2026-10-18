import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({ style: true, script: true })],
	kit: {
		// Static build for GitHub Pages. Everything is prerendered; `404.html`
		// is served by GitHub Pages for any path that wasn't prerendered.
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: false
		}),
		prerender: {
			handleHttpError: ({ path, message }) => {
				// Tolerate the handful of routes that intentionally 404 during a crawl.
				if (path === '/access/') return;
				throw new Error(message);
			}
		},

		csp: {
			mode: 'auto',
			directives: {
				'default-src': ["'self'"],
				'script-src': ["'self'", 'https://analytics.olamaelcu.net'],
				'style-src': ["'self'", "'unsafe-inline'"],
				'img-src': [
					'self',
					'data:',
					'https://cdn.bsky.app',
					'https://avatar-cdn.bsky.app',
					'https://icons.duckduckgo.com'
				],
				'font-src': ["'self'"],
				'connect-src': [
					'self',
					'https://o428404.ingest.us.sentry.io',
					'https://public.api.bsky.app',
					'https://analytics.olamaelcu.net',
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
