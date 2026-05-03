<script lang="ts">
	import type { PageData } from './$types';
	import { MetaTags } from 'svelte-meta-tags';

	let { data }: { data: PageData } = $props();
	let { post, metaTags } = $derived(data);

	let twitterCard = $derived<'summary_large_image'>(
		(metaTags.twitterCard as 'summary_large_image') ?? 'summary_large_image'
	);
</script>

<MetaTags
	title={metaTags.title}
	description={metaTags.description}
	canonical={metaTags.canonical}
	openGraph={{
		type: 'article',
		title: metaTags.title,
		description: metaTags.description,
		images: [{ url: metaTags.ogImage, alt: 'Post OG Image' }]
	}}
	twitter={{
		cardType: twitterCard,
		image: metaTags.twitterImage,
		title: metaTags.title,
		description: metaTags.description
	}}
/>

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
