<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import ProjectPage from '../ProjectPage.svelte';
	import { STATUSES } from '$lib/statuses';
	import { createQuery } from '@tanstack/svelte-query';

	const projectKey = 'spadat';
	const title = 'Spadat';

	const projectsQuery = createQuery(() => ({
		queryKey: ['projects'],
		queryFn: () => fetch('/api/projects').then((r) => r.json())
	}));

	let status = $derived(projectsQuery.data?.[projectKey]?.status ?? STATUSES.INCUBATING);
</script>

<SEO
	title="Spadat | Olamaelcu"
	description="A 4-player partnership Spades card game built on the AT Protocol"
	canonical="https://www.olamaelcu.net/projects/spadat"
	openGraphType="article"
	twitterCard="summary"
/>

<ProjectPage {title} {status} {projectKey}>
	<p>
		A multiplayer Spades card game where match data lives on the AT Protocol. Built with <a
			href="https://godot-rust.github.io/">Godot and Rust</a
		>, featuring a fair shuffle protocol with multi-party entropy and post-hoc verification so any
		observer can independently confirm a match was played fairly.
	</p>
	<h2>Planned Features</h2>
	<ul>
		<li>4-player partnership Spades with configurable rule variations</li>
		<li>Verifiable fair shuffle using commit-reveal with multi-party entropy</li>
		<li>Match history stored as AT Protocol records on each player's PDS</li>
		<li>Cross-platform mobile and desktop client built with Godot</li>
		<li>Real-time multiplayer with spectator mode and WebSocket events</li>
	</ul>
</ProjectPage>
