<script lang="ts">
	import type { PageData } from './$types';
	import { MetaTags } from 'svelte-meta-tags';

	let { data }: { data: PageData } = $props();
	let { post, metaTags, webmentions } = $derived(data);

	let twitterCard = $derived<'summary_large_image'>(
		(metaTags.twitterCard as 'summary_large_image') ?? 'summary_large_image'
	);

	let tocOpen = $state(false);

	function formatDate(dateStr: string): string {
		try {
			return new Date(dateStr).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return dateStr;
		}
	}

	function bskyPostUrl(uri: string): string {
		const parts = uri.replace('at://', '').split('/');
		const did = parts[0];
		const rkey = parts[2];
		return `https://blacksky.community/profile/${did}/post/${rkey}`;
	}
</script>

<svelte:head>
	<link
		rel="site.standard.document external"
		href="at://did:plc:ejggqolmgpylroktvaktibik/site.standard.document/{post.year}-{post.slug}"
	/>
	{#if post.bskyPostUri}
		<script type="module" src="https://esm.sh/gh/loueed/bsky@v1.0.0/comments"></script>
	{/if}
	<link rel="webmention" href="https://webmention.io/olamaelcu.net/webmention" />
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
		<time datetime={post.date}>{formatDate(post.date)}</time>
		<h1>{post.title}</h1>
		{#if post.tags.length}
			<ul class="tags">
				{#each post.tags as tag (tag)}
					<li>{tag}</li>
				{/each}
			</ul>
		{/if}
	</header>

	{#if post.bskyPostUri}
		<p class="comments-link"><a href="#comments">See comments from the Atmosphere</a></p>
	{/if}

	{#if post.audience}
		<p class="audience-label">Intended Audience</p>
		<p class="audience">{post.audience}</p>
	{/if}

	{#if post.toc.length > 0}
		<details class="toc" bind:open={tocOpen}>
			<summary><button aria-expanded={tocOpen}>Table of Contents</button></summary>
			<nav>
				<ol>
					{#each post.toc as item (item.id)}
						<li class="toc-h{item.level}">
							<a href="#{item.id}">{item.text}</a>
						</li>
					{/each}
				</ol>
			</nav>
		</details>
	{/if}

	<div class="content-wrapper">
		<aside class="toc-sidebar">
			<nav>
				<p class="toc-title">Table of Contents</p>
				<ol>
					{#each post.toc as item (item.id)}
						<li class="toc-h{item.level}">
							<a href="#{item.id}">{item.text}</a>
						</li>
					{/each}
				</ol>
			</nav>
		</aside>

		<main>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html post.content}
		</main>
	</div>

	{#if post.bskyPostUri}
		<section id="comments">
			<h2>Comments</h2>
			<bsky-comments post={post.bskyPostUri}></bsky-comments>
			<p class="bsky-empty-notice">
				Comments are hosted on the Atmosphere (Bluesky). <a href={bskyPostUrl(post.bskyPostUri)} target="_blank" rel="noopener noreferrer">View the post on blacksky.community</a> to join the conversation.
			</p>
		</section>
	{/if}

	{#if webmentions && webmentions.length > 0}
		<section id="webmentions" class="webmentions">
			<h2>Webmentions</h2>
			{#each webmentions as mention (mention['wm-id'])}
				<div class="webmention">
					{#if mention.author}
						<div class="webmention-author">
							{#if mention.author.photo}
								<img src={mention.author.photo} alt="" width="32" height="32" />
							{/if}
							{#if mention.author.url && mention.author.name}
								<a href={mention.author.url}>{mention.author.name}</a>
							{:else if mention.author.name}
								<span>{mention.author.name}</span>
							{/if}
						</div>
					{/if}
					{#if mention.content?.text}
						<p>{mention.content.text}</p>
					{/if}
					{#if mention.url}
						<a href={mention.url} class="webmention-source">Source</a>
					{/if}
				</div>
			{/each}
		</section>
	{/if}
</article>

<style>
	article {
		margin: 0 auto;
	}

	.content-wrapper > main {
		line-height: var(--leading-normal);
		max-width: var(--content-4);
		padding: var(--wa-space-m);
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

	.audience-label {
		font-size: var(--text-xs);
		color: var(--text-1);
		opacity: 0.6;
		text-align: center;
		margin-bottom: 0.25rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.audience {
		font-size: var(--text-sm);
		color: var(--text-1);
		opacity: 0.8;
		text-align: center;
		margin-bottom: var(--wa-space-m);
	}

	.comments-link {
		text-align: center;
		margin-bottom: var(--wa-space-s);
	}

	.comments-link a {
		font-size: var(--text-sm);
	}

	.toc {
		margin-bottom: var(--wa-space-m);
		padding: var(--wa-space-xs) var(--wa-space-s);
		background: var(--surface-2);
		border-radius: 0.25rem;
	}

	.toc summary {
		cursor: pointer;
		color: var(--text-1);
	}

	.toc summary button {
		background: none;
		border: none;
		font: inherit;
		cursor: pointer;
		padding: 0;
	}

	.toc nav ol,
	.toc-sidebar nav ol {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.toc-sidebar nav ol {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.toc li {
		margin: 0;
	}

	.toc-h3 {
		padding-left: 1rem;
	}

	.toc a,
	.toc-sidebar a {
		font-size: var(--text-sm);
		color: var(--text-1);
	}

	.toc a:hover,
	.toc-sidebar a:hover {
		text-decoration: underline;
	}

	.content-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
	}

	.toc-sidebar {
		display: none;
	}

	@media (--widescreen) {
		.toc-sidebar {
			display: block;
			position: sticky;
			top: var(--wa-space-m);
			align-self: flex-start;
			width: 15rem;
			flex-shrink: 0;
			padding-right: var(--wa-space-m);
		}

		.content-wrapper {
			flex-direction: row;
		}

		.toc {
			display: none;
		}
	}

	@media (--phone) {
		.toc {
			display: block;
		}

		.toc-title {
			display: none;
		}
	}

	#comments {
		margin-top: var(--wa-space-l);
		padding-top: var(--wa-space-m);
		border-top: 1px solid var(--border-1);
		max-width: var(--content-4);
		margin-inline: auto;
		padding-inline: var(--wa-space-m);
	}

	#comments h2 {
		font-size: var(--text-xl);
		margin-bottom: var(--wa-space-m);
	}

	.bsky-empty-notice {
		font-size: var(--text-sm);
		color: var(--text-1);
		opacity: 0.7;
		text-align: center;
		margin-top: var(--wa-space-m);
	}

	.webmentions {
		margin-top: var(--wa-space-l);
		padding-top: var(--wa-space-m);
		border-top: 1px solid var(--border-1);
		max-width: var(--content-4);
		margin-inline: auto;
		padding-inline: var(--wa-space-m);
	}

	.webmentions h2 {
		font-size: var(--text-xl);
		margin-bottom: var(--wa-space-m);
	}

	.webmention {
		padding: var(--wa-space-s) 0;
		border-bottom: 1px solid var(--border-1);
	}

	.webmention:last-child {
		border-bottom: none;
	}

	.webmention-author {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.webmention-author img {
		border-radius: 50%;
	}

	.webmention-author a {
		font-weight: 500;
	}

	.webmention p {
		font-size: var(--text-sm);
		margin: 0.5rem 0;
	}

	.webmention-source {
		font-size: var(--text-xs);
	}
</style>