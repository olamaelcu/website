<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import ProjectStatus, { STATUSES } from '$lib/components/projectStatus.svelte';
</script>

<MetaTags
	title="Livtet | Olamaelcu"
	description="A local-first, ATProto-friendly book management system"
/>

<section class="lead">
	<h1>Livtet</h1>
	<ProjectStatus status={STATUSES.INCUBATING} />
	<p>A book management system for desktop and mobile.</p>
	<h2>Planned Features</h2>
	<p>Coming soon!</p>
</section>
