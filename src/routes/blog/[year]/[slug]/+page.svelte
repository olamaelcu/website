<script lang="ts">
	import type { PageData } from './$types';
	import { MetaTags } from 'svelte-meta-tags';

	let { data }: { data: PageData } = $props();
	let { post, metaTags } = $derived(data);

	let twitterCard = $derived<'summary_large_image'>(
		(metaTags.twitterCard as 'summary_large_image') ?? 'summary_large_image'
	);
</script>

<svelte:head>
	<link
		rel="site.standard.document external"
		href="at://did:plc:ejggqolmgpylroktvaktibik/site.standard.document/{post.year}-{post.slug}"
	/>
</svelte:head>

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
	:global(main) {
		padding: 0;
	}
	article {
		margin: 0 auto;

		> main {
			line-height: var(--leading-normal);
			max-width: var(--content-4);
			padding: var(--wa-space-m);
		}
	}

	header {
		margin-bottom: var(--wa-space-m);
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	h1 {
		font-family: var(--font-display);
		font-size: var(--text-3xl);
		flex: 1 1;
		text-align: center;
	}

	time {
		font-size: var(--text-base);
	}

	.tags {
		list-style: none;
		padding: 0;
		display: inline-flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		flex-direction: row;
	}

	.tags li {
		background: var(--surface-2);
		padding: 0.125rem 0.5rem;
		border-radius: 0.25rem;
		font-size: var(--text-xs);
		max-width: fit-content;
	}
</style>
