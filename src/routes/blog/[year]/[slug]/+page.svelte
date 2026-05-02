<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { post } = $derived(data);
</script>

<svelte:head>
	<title>{post.title} — Olamaelcu</title>
	<meta name="description" content={post.description} />
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.description} />
	<meta property="og:image" content={`/blog-og/${post.slug}.png`} />
	<meta property="og:type" content="article" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<article>
	<header>
		<time datetime={post.date}>{post.date}</time>
		<h1>{post.title}</h1>
		{#if post.tags.length}
			<ul class="tags">
				{#each post.tags as tag (tag)}
					<li>{tag}</li>
				{/each}
			</ul>
		{/if}
	</header>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html post.content}
</article>

<style>
	article {
		max-width: 65ch;
		margin: 0 auto;
	}
	header {
		margin-bottom: 2rem;
	}
	h1 {
		font-family: var(--font-display);
		margin-top: 0.5rem;
	}
	time {
		font-size: 0.875rem;
		opacity: 0.7;
	}
	.tags {
		list-style: none;
		padding: 0;
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.tags li {
		background: var(--surface-2);
		padding: 0.125rem 0.5rem;
		border-radius: 999px;
		font-size: 0.75rem;
	}
</style>
