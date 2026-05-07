<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import ProjectStatus, { STATUSES } from '$lib/components/projectStatus.svelte';
	import SeatCount from '$lib/components/seatCount.svelte';
</script>

<MetaTags
	title="Livtet | Olamaelcu"
	description="A local-first, ATProto-friendly book management system"
/>

<section class="lead">
	<div class="title-row">
		<h1>Livtet</h1>
		<ProjectStatus status={STATUSES.INCUBATING} />
	</div>
	<SeatCount projectKey="livtet" />
	<p>A book management system for desktop and mobile.</p>
	<h2>Planned Features</h2>
	<p>Coming soon!</p>
</section>
