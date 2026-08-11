import { sentrySvelteKit } from '@sentry/sveltekit';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';
import { ogImagePlugin } from './src/plugins/dynamicOgImage.ts';

export default defineConfig({
  plugins: [
    sentrySvelteKit({
      org: 'olamaelcu',
      project: 'landing'
    }),
    sveltekit(),
    ogImagePlugin()
  ],
  server: {
    port: 5190,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: ['.ngrok-free.app', 'intel-framework.tail68f81e.ts.net']
  },
  test: {
    expect: { requireAssertions: true },
    projects: [
      {
        extends: './vite.config.ts',
        test: {
          name: 'client',
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium', headless: true }]
          },
          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: ['src/lib/server/**']
        }
      },

      {
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
        }
      }
    ]
  }
});
