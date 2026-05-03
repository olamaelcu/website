import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({ style: true, script: true })],
	kit: {
		origin: 'https://olamaelcu.net',
		adapter: adapter()
	}
};

export default config;
