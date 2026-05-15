<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import ProjectPage from '../ProjectPage.svelte';
	import { STATUSES } from '$lib/statuses';
	import { createQuery } from '@tanstack/svelte-query';

	const projectKey = 'scratchback';
	const title = 'Scratchback';

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

<ProjectPage {title} {status} {projectKey}>
	<p>
		A service that provides live services, game state synchronization and achievements for
		independent game developers and studios alike leveraging
		<a href="https://atproto.com/?ref=olamaelcu" target="_blank">ATProto</a>.
	</p>
	<p>
		Note: this service is currently optimized for games hosted on <a
			href="https://itch.io/?ref=olamaelcu">itch.io</a
		>. If you'd like to talk about integrating your platform, please
		<a href="mailto:hey@olamaelcu.net">reach out</a>.
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
</ProjectPage>
