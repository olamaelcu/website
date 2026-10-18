<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import ProjectPage from '../ProjectPage.svelte';
	import { STATUSES } from '$lib/statuses';
	import { createQuery } from '@tanstack/svelte-query';

	const projectKey = 'scratchback';
	const title = 'Scratchback';

	const projectsQuery = createQuery(() => ({
		queryKey: ['projects'],
		queryFn: () => fetch('/data/projects.json').then((r) => r.json())
	}));

	let status = $derived(projectsQuery.data?.[projectKey]?.status ?? STATUSES.INCUBATING);
</script>

<SEO
	title="Scratchback | Olamaelcu"
	description="A service that gives indie game developers and their players cross-device saves, achievements, and leaderboards — with a unified play history the player owns on the open social web."
	canonical="https://www.olamaelcu.net/projects/scratchback"
	openGraphType="article"
	twitterCard="summary"
/>

<ProjectPage {title} {status} {projectKey}>
	<p>
		A service for independent game developers and the people who play their games, making it easy to
		ship cross-device saves, achievements, and fair leaderboards. It plugs into
		<a href="https://itch.io/?ref=olamaelcu" target="_blank">itch.io</a> today so a developer can sign
		in, import their library, and start connecting players in minutes.
	</p>
	<h2>What it does</h2>
	<p>
		Scratchback keeps a player's save data in sync across devices while the server itself can never
		read it — the keys stay with the player. Each player gets a unified game history that they own
		and carry with them on their identity on the open social web, so progress follows them wherever
		they log in. Incremental saves reconcile cleanly when a connection returns, and server-validated
		leaderboards keep rankings honest.
	</p>
	<h2>Partnering with platforms</h2>
	<p>
		Today Scratchback focuses on
		<a href="https://itch.io/?ref=olamaelcu" target="_blank">itch.io</a>, where the indie game
		community is already centered. If you ship elsewhere, please
		<a href="mailto:hey@olamaelcu.net">reach out</a> — partnerships shape what integrations land next.
	</p>
	<h2>Where this is heading</h2>
	<p>
		What is shipped is the foundation — saves, achievements, and leaderboards working end-to-end,
		with two engine hooks in active use. The roadmap below tracks the next steps; here is the shape
		of what is on the way.
	</p>
	<ul>
		<li>
			Expand engine coverage beyond the current two hooks, with a third engine integration underway
			so more developers can drop it into their projects without rework.
		</li>
		<li>
			Community features for players: bookmarks, sharing, and replayable highlights so people can
			revisit and show off the moments that mattered to them.
		</li>
		<li>
			Tighten the offline and first-install experience so a brand-new player lands in the game and
			starts playing immediately, with history catching up the moment they are back online.
		</li>
		<li>
			Hosted services that complement what is already running on-device, so developers can pick and
			choose what they host versus what Scratchback handles.
		</li>
	</ul>
</ProjectPage>
