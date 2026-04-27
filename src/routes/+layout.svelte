<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	import '../app.css';
	import '@awesome.me/webawesome/dist/styles/webawesome.css';

	let { children } = $props();

	function flagForLocale(locale: string) {
		switch (locale) {
			case 'en':
				return '🇬🇧';
			case 'fr':
				return '🇫🇷';
			case 'ht':
				return '🇭🇹';
		}
	}

	function nativeLocaleName(locale: string) {
		switch (locale) {
			case 'en':
				return 'English';
			case 'fr':
				return 'Français';
			case 'ht':
				return 'Kreyol';
		}
	}
</script>

<header>
	<a class="logotype" href={resolve('/')}>
		<img src="/favicon.png" alt="Olamaelcu" />
		<span>Olamaelcu</span>
	</a>
	<nav class="places">
		<!-- <a href={resolve('/about')}>About</a> -->
		<!-- <a href={resolve('/projects')}>Projects</a> -->
		<!-- <a href={resolve('/work')}>Work</a> -->
	</nav>
	<nav class="lang">
		{#each locales as locale (locale)}
			<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}
				>{flagForLocale(locale)}<span>&nbsp;{nativeLocaleName(locale)}</span></a
			>
		{/each}
	</nav>
</header>
<main>
	{@render children()}
</main>
<footer></footer>
