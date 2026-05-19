<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { initPlausible } from '$lib/analytics';
	import PageLoader from '$lib/components/PageLoader.svelte';
	import '../app.css';
	import '@awesome.me/webawesome/dist/styles/webawesome.css';

	let { data, children } = $props();

	onMount(() => {
		initPlausible();
	});
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
	<SvelteQueryDevtools client={data.queryClient} />
	<PageLoader />
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
		<a href={resolve('/terms')}>Terms</a>&nbsp;&mdash;
		<a href={resolve('/privacy')}>Privacy</a>&nbsp;&mdash;
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a rel="nofollow noindex" href="/access/">Traffic</a>&nbsp;&mdash;
		<a href={resolve('/stack')}>Stack</a>&nbsp;&mdash;
		<a rel="me" href="https://www.linkedin.com/company/104865492">LinkedIn</a>&nbsp;&mdash;
		<a rel="me" href="https://blacksky.community/profile/olamaelcu.net">Atmosphere (Blacksky)</a>
	</footer>
</QueryClientProvider>
