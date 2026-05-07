<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import ProjectStatus, { STATUSES } from '$lib/components/projectStatus.svelte';
	import SeatCount from '$lib/components/seatCount.svelte';
</script>

<MetaTags title="Ticaye | Olamaelcu" />

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
