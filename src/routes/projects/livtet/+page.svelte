<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import ProjectPage from '../ProjectPage.svelte';
	import ProjectStatus from '$lib/components/projectStatus.svelte';
	import { STATUSES } from '$lib/statuses';
	import { createQuery } from '@tanstack/svelte-query';

	const projectKey = 'livtet';
	const title = 'Livtet';

	const projectsQuery = createQuery(() => ({
		queryKey: ['projects'],
		queryFn: () => fetch('/api/projects').then((r) => r.json())
	}));

	let status = $derived(projectsQuery.data?.[projectKey]?.status ?? STATUSES.INCUBATING);
</script>

<SEO
	title="Livtet | Olamaelcu"
	description="A local-first, ATProto-friendly book management system"
	canonical="https://www.olamaelcu.net/projects/livtet"
	openGraphType="article"
	twitterCard="summary"
/>

<ProjectPage {title} {status} {projectKey}>
	<p>
		A local-first book collection manager for desktop and mobile. Keep your library on your own
		terms — your data lives on your device, with optional sync to services you already use. Works
		with the Fediverse and ATProto so you can share reading activity on your own terms.
	</p>
	<h2>Features</h2>
	<ul>
		<li>
			Manage your full book collection — physical, digital, and audiobooks — in one place
		</li>
		<li>Sync reading progress and collections with e-readers like Kobo and Kindle</li>
		<li>Capture annotations, create reading lists, and search across your entire library</li>
		<li>Share what you're reading through ATProto and the Fediverse</li>
		<li>Look up books from Open Library, WorldCat, and other catalog sources</li>
	</ul>
</ProjectPage>
