<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import ProjectStatus, { STATUSES } from '$lib/components/projectStatus.svelte';
	import SeatCount from '$lib/components/seatCount.svelte';
</script>

<SEO
	title="Livtet | Olamaelcu"
	description="A local-first, ATProto-friendly book management system"
	canonical="https://www.olamaelcu.net/projects/livtet"
	openGraphType="article"
	twitterCard="summary"
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
