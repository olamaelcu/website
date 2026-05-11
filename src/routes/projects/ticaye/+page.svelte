<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import ProjectStatus, { STATUSES } from '$lib/components/projectStatus.svelte';
	import SeatCount from '$lib/components/seatCount.svelte';
</script>

<SEO
	title="Ticaye | Olamaelcu"
	description="Ticaye — coming soon."
	canonical="https://www.olamaelcu.net/projects/ticaye"
	openGraphType="article"
	twitterCard="summary"
/>

<div class="title-row">
	<h1>Ticaye</h1>
	<ProjectStatus status={STATUSES.INCUBATING} />
</div>
<SeatCount projectKey="ticaye" />
<p>Coming soon.</p>

<style>
	:global(main) {
		margin: 0 auto;
		width: 80vw;
		max-width: var(--content-3);
		flex-direction: column;
	}
</style>
