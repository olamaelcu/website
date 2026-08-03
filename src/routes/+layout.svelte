<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { initPlausible } from '$lib/analytics';
	import PageLoader from '$lib/components/PageLoader.svelte';
	import '../app.css';
	import '@awesome.me/webawesome/dist/styles/webawesome.css';

	let { data, children } = $props();

	let mounted = $state(false);

	if (browser) {
		Promise.all([
			import('@awesome.me/webawesome/dist/components/page/page.js'),
			import('@awesome.me/webawesome/dist/components/drawer/drawer.js'),
			import('@awesome.me/webawesome/dist/components/button/button.js'),
			import('@awesome.me/webawesome/dist/components/icon/icon.js')
		]).then(() => {
			mounted = true;
		});
	}

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
	<link
		rel="site.standard.publication external"
		href="at://did:plc:ejggqolmgpylroktvaktibik/site.standard.publication/olamaelcu-publication"
	/>
</svelte:head>

<QueryClientProvider client={data.queryClient}>
	<SvelteQueryDevtools client={data.queryClient} />
	<PageLoader />
	{#if mounted}
		<wa-page mobile-breakpoint="40rem" navigation-placement="end">
			<div slot="header" class="header-bar">
				<a class="logotype" href={resolve('/')}>
					<img src="/favicon.png" alt="Olamaelcu" />
					<span>Olamaelcu</span>
				</a>
				<nav class="places desktop-nav">
					<a href={resolve('/about')}>About</a>
					<a href={resolve('/blog')}>Blog</a>
					<a href={resolve('/projects')}>Projects</a>
					<a href="https://waitlist.olamaelcu.net">Waitlist</a>
					<a href="https://dl.olamaelcu.net">Downloads</a>
				</nav>
			</div>
			<nav slot="navigation" class="places mobile-nav">
				<a href={resolve('/about')}>About</a>
				<a href={resolve('/blog')}>Blog</a>
				<a href={resolve('/projects')}>Projects</a>
				<a href="https://waitlist.olamaelcu.net">Waitlist</a>
				<a href="https://dl.olamaelcu.net">Downloads</a>
			</nav>
			<main>
				{@render children()}
			</main>
			<footer slot="footer">
				<div class="footer-content">
					Olamaelcu, a software lab by <a href="https://www.jacky.wtf/?ref=olamaelcu">Jacky</a><br />
					Contact: <a href="mailto:contact@olamaelcu.net">contact@olamaelcu.net</a><br />
					<a href={resolve('/terms')}>Terms</a>&nbsp;&mdash;
					<a href={resolve('/privacy')}>Privacy</a>&nbsp;&mdash;
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a rel="nofollow noindex" href="/access/">Traffic</a>&nbsp;&mdash;
					<a href={resolve('/stack')}>Stack</a>&nbsp;&mdash;
					<a rel="me" href="https://www.linkedin.com/company/104865492">LinkedIn</a>&nbsp;&mdash;
					<a rel="me" href="https://blacksky.community/profile/olamaelcu.net">Bluesky</a>
				</div>
			</footer>
		</wa-page>
	{:else}
		<header>
			<div class="header-bar">
				<a class="logotype" href={resolve('/')}>
					<img src="/favicon.png" alt="Olamaelcu" />
					<span>Olamaelcu</span>
				</a>
				<nav class="desktop-nav">
					<a href={resolve('/about')}>About</a>
					<a href={resolve('/blog')}>Blog</a>
					<a href={resolve('/projects')}>Projects</a>
					<a href="https://waitlist.olamaelcu.net">Waitlist</a>
					<a href="https://dl.olamaelcu.net">Downloads</a>
				</nav>
			</div>
		</header>
		<main>
			{@render children()}
		</main>
		<footer>
			<div class="footer-content">
				Olamaelcu, a software lab by <a href="https://www.jacky.wtf/?ref=olamaelcu">Jacky</a><br />
				Contact: <a href="mailto:contact@olamaelcu.net">contact@olamaelcu.net</a><br />
				<a href={resolve('/terms')}>Terms</a>&nbsp;&mdash;
				<a href={resolve('/privacy')}>Privacy</a>&nbsp;&mdash;
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a rel="nofollow noindex" href="/access/">Traffic</a>&nbsp;&mdash;
				<a href={resolve('/stack')}>Stack</a>&nbsp;&mdash;
				<a rel="me" href="https://www.linkedin.com/company/104865492">LinkedIn</a>&nbsp;&mdash;
				<a rel="me" href="https://blacksky.community/profile/olamaelcu.net">Atmosphere (Blacksky)</a>
			</div>
		</footer>
	{/if}
</QueryClientProvider>
