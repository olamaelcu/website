<script lang="ts">
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';
	import SEO from '$lib/components/SEO.svelte';
	import { SITE_URL } from '$lib/constants';

	let { data }: { data: PageData } = $props();
	let { posts, atomFeed, jsonFeed } = $derived(data);

	let byYear = $derived(
		posts.reduce<Record<string, typeof posts>>((acc, p) => {
			(acc[p.year] ??= []).push(p);
			return acc;
		}, {})
	);
</script>

<SEO
	title="Blog | Olamaelcu"
	description="Thoughts, tutorials, and updates from Olamaelcu."
	canonical={`${SITE_URL}/blog`}
	openGraphType="website"
	ogImage={`${SITE_URL}/og-default.png`}
	twitterImage={`${SITE_URL}/og-default.png`}
/>

<section>
	<h1>Blog</h1>

	<div class="feed-links">
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href={atomFeed} target="_blank" rel="noopener noreferrer">ATOM Feed</a>
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href={jsonFeed} target="_blank" rel="noopener noreferrer">JSON Feed</a>
	</div>

	{#each Object.entries(byYear).sort(([a], [b]) => b.localeCompare(a)) as [year, yearPosts] (year)}
		<section>
			<h2>{year}</h2>
			<ul class="post-list">
				{#each yearPosts as post (post.slug)}
					<li>
						<a href={resolve(`/blog/${post.year}/${post.slug}`)}>{post.title}</a>
						<time datetime={post.date}>{post.date}</time>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</section>

<style>
	h1 {
		font-size: var(--text-3xl);
	}
	h2 {
		font-size: var(--text-sm);
		font-weight: normal;
		opacity: 0.6;
		font-family: var(--font-sans);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.post-list {
		list-style: none;
		padding: 0;
		margin: 0 0 var(--wa-space-m);
	}
	.post-list li {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border-1);
		margin: 0;
	}
	.post-list li:first-child {
		border-top: 1px solid var(--border-1);
	}
	.post-list a {
		color: var(--text-1);
		font-size: var(--text-base);
		text-decoration: underline;
	}
	.post-list a:hover {
		text-decoration: underline;
	}
	time {
		font-size: var(--text-base);
		flex-shrink: 0;
	}

	section {
		max-width: var(--content-4);
		margin: 0 auto;
		width: 100%;
	}

	.feed-links {
		margin-bottom: var(--wa-space-m);
		display: flex;
		gap: 1rem;
	}
	.feed-links a {
		padding: 0.5rem 1rem;
		background: var(--surface-2);
		border-radius: 4px;
		text-decoration: none;
		font-size: var(--text-sm);
	}
	.feed-links a:hover {
		background: var(--surface-3);
	}
</style>
