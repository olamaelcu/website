<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import Favicon from '$lib/components/Favicon.svelte';
	import { SITE_URL } from '$lib/constants';

	let { data } = $props();
</script>

<SEO
	title="Stack | Olamaelcu"
	description="The tools, services, and open-source software that power Olamaelcu."
	canonical={`${SITE_URL}/stack`}
	openGraphType="website"
	ogImage={`${SITE_URL}/og-default.png`}
	twitterImage={`${SITE_URL}/og-default.png`}
/>

<section>
	<h1>Stack</h1>
	<p class="subtitle">The tools, services, and open source software that power Olamaelcu.</p>

	{#each Object.entries(data.categories) as [category, items]}
		<div class="category">
			<h2>{category}</h2>
			<ul class="stack-grid">
				{#each items as item}
					<li>
						<a href={item.url} class="stack-item">
							<span class="item-header">
								<Favicon domain={item.domain} alt={item.name} size={24} />
								<span class="name">{item.name}</span>
							</span>
							<span class="description">{item.description}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}

	<h2>Our Open Source Projects</h2>
	<ul class="repos">
		{#each data.repositories as repo}
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

	<p class="attribution">
		Inspired by <a href="https://buttondown.com/stack">Buttondown's Stack</a>.
	</p>
</section>

<style>
	:global(main) {
		max-width: 70rem;
	}
	section {
		margin: 0 auto;
	}
	h1 {
		font-family: var(--font-display);
		margin-top: var(--wa-space-xs);
		text-align: center;
	}
	.subtitle {
		text-align: center;
		margin-bottom: var(--wa-space-xl);
	}
	h2 {
		font-family: var(--font-display);
		margin-top: var(--wa-space-xl);
		margin-bottom: var(--wa-space-m);
	}
	.category {
		margin-bottom: var(--wa-space-l);
	}
	.stack-grid {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--wa-space-xs);
	}
	.stack-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 1px solid var(--link);
		text-decoration: none;
		transition: border-color 0.2s ease;
	}
	.stack-item:hover {
		border-color: var(--wa-color-primary);
	}
	.name {
		font-weight: 600;
	}

	.item-header {
		display: flex;
		align-items: center;
		padding: var(--wa-space-xs);
		width: 100%;
		flex: 1 1;
		font-size: var(--text-sm);
		background-color: var(--wa-color-neutral-80);
		color: var(--wa-color-neutral-05);

		& {
			span {
				margin-left: var(--wa-space-xs);
			}
		}
	}

	.description {
		font-size: var(--text-sm);
		padding: var(--wa-space-xs) 0;
	}
	.repos {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--wa-space-xs);
	}
	.repos li {
		margin: 0;
		padding: 0;
	}
	.repos a {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto auto;
		gap: var(--wa-space-xs) var(--wa-space-m);
		padding: var(--wa-space-s) var(--wa-space-m);
		border: 1px solid var(--link);
		text-decoration: none;
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
	}
	.attribution {
		margin-top: var(--wa-space-xl);
		text-align: center;
		font-size: var(--text-sm);
	}
</style>
