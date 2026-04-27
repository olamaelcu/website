<script lang="ts">
	import { resolve } from '$app/paths';
	import '../app.css';
	import '@awesome.me/webawesome/dist/styles/webawesome.css';

	let { children } = $props();
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
<footer></footer>
