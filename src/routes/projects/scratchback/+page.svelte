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
	<p>
		All save data is encrypted so the server never sees your players' information. Games work
		offline and sync seamlessly when connected — no lost saves, no conflicts.
	</p>
	<h2>Features</h2>
	<ul>
		<li>
			Players get a unified game history and a way to <strong>share gameplay experiences</strong>
		</li>
		<li>
			Games can reference information from other titles to <strong>enrich gameplay</strong>
		</li>
		<li>Save data syncs incrementally and handles conflicts gracefully</li>
		<li>Achievements with customizable visibility — public, hidden, or private</li>
		<li>Server-validated leaderboards to keep rankings fair</li>
		<li>SDKs available for Bevy and Godot game engines</li>
	</ul>
</ProjectPage>
