<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import ProjectStatus, { STATUSES } from '$lib/components/projectStatus.svelte';
	import SeatCount from '$lib/components/seatCount.svelte';
	import { createQuery } from '@tanstack/svelte-query';

	const projectKey = 'scratchback';

	const projectsQuery = createQuery(() => ({
		queryKey: ['projects'],
		queryFn: () => fetch('/api/projects').then((r) => r.json())
	}));

	let status = $derived(projectsQuery.data?.[projectKey]?.status ?? STATUSES.INCUBATING);
</script>

<SEO
	title="Scratchback | Olamaelcu"
	description="Live services, game state synchronization and achievements for independent game developers and studios alike leveraging ATProto."
	canonical="https://www.olamaelcu.net/projects/scratchback"
	openGraphType="article"
	twitterCard="summary"
/>

<section class="lead">
	<div class="title-row">
		<h1>Scratchback</h1>
		<ProjectStatus {status} />
	</div>
	<SeatCount {projectKey} />
	<p>
		Live services, game state synchronization and achievements for indepenent game developers and
		studios alike leveraging <a href="https://atproto.com/?ref=olamaelcu" target="_blank">ATProto</a
		>.
	</p>
	<h2>Planned Features</h2>
	<ul>
		<li>
			Players provided with a means of reviewing their game history and a means of <strong
				>sharing gameplay experiences</strong
			>
		</li>
		<li>
			Games can leverage information from other titles in their warehouse to <strong
				>enrich gameplay experience</strong
			>
		</li>
		<li>Save information can be done incrementally and in a conflict-resistant way</li>
	</ul>
</section>
