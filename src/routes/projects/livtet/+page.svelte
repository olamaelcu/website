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
	description="A book collection manager shaped around the Works and Editions you actually own, available across desktop, Android, and iOS."
	canonical="https://www.olamaelcu.net/projects/livtet"
	openGraphType="article"
	twitterCard="summary"
/>

<ProjectPage {title} {status} {projectKey}>
	<p>
		A book collection manager built around the Works and Editions you actually own, available across
		desktop, Android, and iOS, with your library living on your own device.
	</p>
	<h2>What's in the box today</h2>
	<p>
		Desktop is available today, the Android app is available today, and the iOS app is on the way.
	</p>
	<h2>Heading next</h2>
	<p>What is still on the way, in plain language.</p>
	<ul>
		<li>Sharing reading activity with the social networks you already use.</li>
		<li>Annotation capture that travels with the Editions you own.</li>
		<li>Sync to e-readers you already own.</li>
		<li>Catalog lookups from a wider range of sources.</li>
	</ul>
</ProjectPage>
