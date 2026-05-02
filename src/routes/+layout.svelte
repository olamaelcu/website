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
</script>

<MetaTags
	title="Olamaelcu"
	description="A software lab making things for people to experiment with and understand."
	canonical="https://olamaelcu.net"
	openGraph={{
		type: 'website',
		siteName: 'Olamaelcu',
		url: 'https://olamaelcu.net',
		images: [
			{
				url: 'https://olamaelcu.net/favicon.png',
				alt: 'Olamaelcu logo'
			}
		]
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
	<a href={plausibleUrl}>Analytics</a>&nbsp;&mdash;
	<code>{data.commit ? data.commit : ''}</code>
</footer>
