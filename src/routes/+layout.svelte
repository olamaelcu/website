<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { QueryClientProvider } from '@tanstack/svelte-query';
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

<QueryClientProvider client={data.queryClient}>
	<header>
		<a class="logotype" href={resolve('/')}>
			<img src="/favicon.png" alt="Olamaelcu" />
			<span>Olamaelcu</span>
		</a>
		<nav class="places">
			<a href={resolve('/about')}>About</a>
			<a href={resolve('/blog')}>Blog</a>
			<a href={resolve('/projects')}>Projects</a>
			<a href="https://waitlist.olamaelcu.net">Waitlist</a>
		</nav>
	</header>
	<main>
		{@render children()}
	</main>
	<footer>
		Olamaelcu, a software lab by <a href="https://www.jacky.wtf/?ref=olamaelcu">Jacky</a><br />
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href={plausibleUrl}>Analytics</a>&nbsp;&mdash;
		<a href={resolve('/terms')}>Terms</a>&nbsp;&mdash;
		<a href={resolve('/privacy')}>Privacy</a>&nbsp;&mdash;
		<code>{data.commit ? data.commit : ''}</code>
	</footer>
</QueryClientProvider>