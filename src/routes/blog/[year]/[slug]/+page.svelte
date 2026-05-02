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
	<main>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html post.content}
	</main>
</article>

<style>
	article {
		max-width: var(--size-content-3);
		margin: 0 auto;

		> main {
			line-height: var(--font-lineheight-3);

			:global(p) {
				margin: var(--size-2) 0;

				&:first-child {
					margin-top: 0;
				}
			}
		}
	}
	header {
		margin-bottom: 2rem;
		display: flex;
		align-items: center;
	}
	h1 {
		font-family: var(--font-display);
		margin-top: 0.5rem;
		flex: 1 1;
		text-align: center;
	}
	time {
		font-size: var(--font-size-3);
	}
	.tags {
		list-style: none;
		padding: 0;
		display: inline-flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		flex-direction: column;
	}
	.tags li {
		background: var(--surface-2);
		padding: 0.125rem 0.5rem;
		border-radius: 999px;
		font-size: 0.75rem;
		max-width: fit-content;
	}
</style>
