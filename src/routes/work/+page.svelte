<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { SITE_URL } from '$lib/constants';
</script>

<SEO
	title="Work | Olamaelcu"
	description="Projects and work by Olamaelcu, a software lab."
	canonical={`${SITE_URL}/work`}
	openGraphType="website"
	ogImage={`${SITE_URL}/og-default.png`}
	twitterImage={`${SITE_URL}/og-default.png`}
/>

<h1>Work</h1>
<p>Coming soon.</p>

<style>
	:global(main) {
		margin: 0 auto;
		width: 80vw;
		max-width: var(--content-3);
		flex-direction: column;
	}
</style>
