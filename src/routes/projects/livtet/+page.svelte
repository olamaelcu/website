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
	<p>A book management system for desktop and mobile that works with ATProto and the Fediverse.</p>
	<h2>Planned Features</h2>
	<ul>
		<li>Manage a book collection using a familiar interface</li>
		<li>Synchronize your reading history and collection with popular services</li>
		<li>Capture annotations about what you've read</li>
	</ul>
</ProjectPage>
