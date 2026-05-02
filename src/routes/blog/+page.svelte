<script lang="ts">
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();
	let { posts } = $derived(data);

	let byYear = $derived(
		posts.reduce<Record<string, typeof posts>>((acc, p) => {
			(acc[p.year] ??= []).push(p);
			return acc;
		}, {})
	);
</script>

<svelte:head>
	<title>Blog — Olamaelcu</title>
	<meta name="description" content="Thoughts, tutorials, and updates from Olamaelcu." />
</svelte:head>

<section>
	<h1>Blog</h1>

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
		margin-bottom: 2rem;
	}
	h2 {
		font-size: 1rem;
		font-weight: normal;
		opacity: 0.6;
		margin-bottom: 0.75rem;
		font-family: var(--font-sans);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.post-list {
		list-style: none;
		padding: 0;
		margin: 0 0 2rem;
	}
	.post-list li {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--border-1);
	}
	.post-list li:first-child {
		border-top: 1px solid var(--border-1);
	}
	.post-list a {
		color: var(--text-1);
		text-decoration: underline;
	}
	.post-list a:hover {
		text-decoration: underline;
	}
	time {
		font-size: var(--font-size-3);
		flex-shrink: 0;
	}

	section {
		max-width: var(--size-content-3);
		margin: 0 auto;
		width: 100%;
	}
</style>
