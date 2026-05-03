<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { trackClick, trackCommit, enableOutboundTracking } from '$lib/analytics';
	import '../app.css';
	import '@awesome.me/webawesome/dist/styles/webawesome.css';

	let { data, children } = $props();

	onMount(() => {
		trackCommit(data.commit);
		enableOutboundTracking();
		document.addEventListener('click', trackClick);
		return () => document.removeEventListener('click', trackClick);
	});

	let plausibleUrl = $derived(`https://plausible.io/olamaelcu.net?f=is,page,${$page.url.pathname}`);

	let resolvedCanonicalUrl = $derived(data.metaTags?.canonical ?? 'https://olamaelcu.net');
	let resolvedOgImageUrl = $derived(data.metaTags?.ogImage ?? 'https://olamaelcu.net/favicon.png');
	let resolvedOgTitle = $derived(data.metaTags?.title ?? 'Olamaelcu');
	let resolvedOgDescription = $derived(
		data.metaTags?.description ??
			'A software lab making things for people to experiment with and understand.'
	);
	let resolvedTwitterCard = $derived<'summary_large_image'>(
		(data.metaTags?.twitterCard as 'summary_large_image') ?? 'summary_large_image'
	);
	let resolvedTwitterImage = $derived(
		data.metaTags?.twitterImage ?? 'https://olamaelcu.net/favicon.png'
	);
	let resolvedTwitterTitle = $derived(data.metaTags?.title ?? 'Olamaelcu');
	let resolvedTwitterDescription = $derived(
		data.metaTags?.description ??
			'A software lab making things for people to experiment with and understand.'
	);
</script>

<svelte:head>
	<link
		rel="alternate"
		type="application/atom+xml"
		href="https://olamaelcu.net/feed/atom"
		title="Olamaelcu Blog - ATOM Feed"
	/>
	<link
		rel="alternate"
		type="application/feed+json"
		href="https://olamaelcu.net/feed/json"
		title="Olamaelcu Blog - JSON Feed"
	/>
</svelte:head>

<MetaTags
	title={resolvedOgTitle}
	description={resolvedOgDescription}
	canonical={resolvedCanonicalUrl}
	openGraph={{
		type: 'website',
		siteName: 'Olamaelcu',
		url: 'https://olamaelcu.net',
		images: [{ url: resolvedOgImageUrl, alt: 'Olamaelcu logo' }]
	}}
	twitter={{
		cardType: resolvedTwitterCard,
		image: resolvedTwitterImage,
		title: resolvedTwitterTitle,
		description: resolvedTwitterDescription
	}}
/>

<header>
	<a class="logotype" href={resolve('/')}>
		<img src="/favicon.png" alt="Olamaelcu" />
		<span>Olamaelcu</span>
	</a>
	<nav class="places">
		<a href={resolve('/about')}>About</a>
		<a href={resolve('/blog')}>Blog</a>
		<!-- <a href={resolve('/work')}>Work</a> -->
	</nav>
	<!-- <nav class="lang"> -->
	<!-- 	{#each locales as locale (locale)} -->
	<!-- 		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)} -->
	<!-- 			>{flagForLocale(locale)}<span>&nbsp;{nativeLocaleName(locale)}</span></a -->
	<!-- 		> -->
	<!-- 	{/each} -->
	<!-- </nav> -->
</header>
<main>
	{@render children()}
</main>
<footer>
	Olamaelcu, a software lab by <a href="https://www.jacky.wtf/?ref=olamaelcu">Jacky</a>&nbsp;&mdash;
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a href={plausibleUrl}>Analytics</a>&nbsp;&mdash;
	<code>{data.commit ? data.commit : ''}</code>
</footer>
