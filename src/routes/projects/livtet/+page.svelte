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
	<p>
		A few of the directions in flight, kept short so the live roadmap below stays the source of
		truth.
	</p>
	<ul>
		<li>
			A hosted place to publish a reading list as a public web link that anyone can follow and get
			notified about, even without the app.
		</li>
		<li>
			A browseable catalog of installable plugins, so trusted plugins are easier to find and install
			than they are today.
		</li>
		<li>
			Series and volume grouping on the work page, so omnibus editions and custom reading orders
			have a place to live.
		</li>
		<li>
			A full hosted, browser-based version of the app for the moments when no device is handy.
		</li>
		<li>
			Richer book previews when you share from your phone, so the book drops into chats and messages
			as something tappable rather than a plain link.
		</li>
	</ul>
</ProjectPage>
