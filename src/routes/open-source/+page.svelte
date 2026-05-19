<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { SITE_URL } from '$lib/constants';
	import { createQuery } from '@tanstack/svelte-query';

	const query = createQuery(() => ({
		queryKey: ['repositories'],
		queryFn: async () => {
			const response = await fetch('/api/repositories');
			if (!response.ok) {
				throw new Error('Failed to fetch repositories');
			}
			return response.json();
		},
		staleTime: 5 * 60 * 1000
	}));
</script>

<SEO
	title="Open Source | Olamaelcu"
	description="Open source projects from Olamaelcu, a software lab providing web experiments and services."
	canonical={`${SITE_URL}/open-source`}
	openGraphType="website"
	ogImage={`${SITE_URL}/og-default.png`}
	twitterImage={`${SITE_URL}/og-default.png`}
/>

<section>
	<h1>Open Source</h1>

	<h2>Built with Open Source</h2>
	<p class="built-with">
		This project is made possible by the following open source software:
	</p>
	<ul class="dependencies">
		<li><a href="https://svelte.dev">Svelte</a> &amp; <a href="https://kit.svelte.dev">SvelteKit</a></li>
		<li><a href="https://www.typescriptlang.org">TypeScript</a></li>
		<li><a href="https://vitejs.dev">Vite</a></li>
		<li><a href="https://atproto.com">AT Protocol</a></li>
		<li><a href="https://github.com/nickshanks/Hook0">Hook0</a></li>
		<li><a href="https://postgresql.org">PostgreSQL</a></li>
		<li><a href="https://redis.io">Redis</a></li>
	</ul>

	<h2>Our Open Source Projects</h2>
	{#if query.isPending}
		<p>Loading repositories...</p>
	{:else if query.isError}
		<p>Failed to load repositories. Please try again later.</p>
	{:else if query.data}
		<ul class="repos">
			{#each query.data as repo (repo.name)}
				<li>
					<a href={repo.forgeUrl}>
						<strong>{repo.name}</strong>
						<span class="description">{repo.description}</span>
						{#if repo.topics && repo.topics.length > 0}
							<ul class="topics">
								{#each repo.topics as topic}
									<li class="topic">{topic}</li>
								{/each}
							</ul>
						{/if}
						<span class="stars">★ {repo.starCount}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	section {
		max-width: 65ch;
		margin: 0 auto;
	}
	h1 {
		font-family: var(--font-display);
		margin-top: var(--wa-space-xs);
		text-align: center;
	}
	h2 {
		font-family: var(--font-display);
		margin-top: var(--wa-space-l);
	}
	.built-with {
		font-size: var(--text-sm);
		opacity: 0.7;
	}
	.dependencies {
		list-style: disc;
		padding-left: var(--wa-space-m);
		display: flex;
		flex-wrap: wrap;
		gap: var(--wa-space-xs) var(--wa-space-m);
	}
	.repos {
		list-style: none;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--wa-space-m);
	}
	.repos li {
		margin: 0;
		padding: 0;
		box-shadow: var(--wa-shadow-s);
	}
	.repos a {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto auto;
		gap: 0 var(--wa-space-xs);
		padding: var(--wa-space-m);
		border: 1px solid var(--link);
		text-decoration: none;
		height: 100%;
		box-sizing: border-box;
	}
	.repos strong {
		grid-column: 1;
		grid-row: 1;
	}
	.description {
		grid-column: 1 / -1;
		grid-row: 2;
		font-size: var(--text-sm);
		opacity: 0.7;
	}
	.topics {
		grid-column: 1 / -1;
		grid-row: 3;
		list-style: none;
		padding: 0;
		margin: var(--wa-space-xs) 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: var(--wa-space-xs);
	}
	.topic {
		font-size: var(--text-xs);
		padding: 2px 6px;
		background: var(--wa-color-surface-container-low);
		border-radius: var(--wa-radius-s);
	}
	.stars {
		grid-column: 2;
		grid-row: 1;
		font-size: var(--text-sm);
		opacity: 0.7;
	}
</style>
