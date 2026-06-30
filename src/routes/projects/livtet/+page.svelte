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
	description="A book collection manager shaped around the books you actually own, available across desktop, Android, and iOS."
	canonical="https://www.olamaelcu.net/projects/livtet"
	openGraphType="article"
	twitterCard="summary"
/>

<ProjectPage {title} {status} {projectKey}>
	<p>
		A book collection manager built around the <strong>books</strong> you actually own, available across
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
	<h2>Beyond the library</h2>
	<p>
		The same library, opened up — authors can ship plugins that extend the catalog, run their own
		page and community, and your account is the bridge to the broader social web.
	</p>
	<ul>
		<li>
			Build a plugin in a small scripting language and ship it — the plugin surface covers
			reading-progress sync, annotations, reading lists, and series grouping.
		</li>
		<li>
			Submit your plugin to a curated, signed repository on the way, so readers can discover and
			install trusted extensions.
		</li>
		<li>
			Verified author and publisher pages with a hosted author site on a free subdomain or your own
			custom domain, plus giveaways and preorder alerts readers can opt into.
		</li>
		<li>
			Your account is yours across every device, with a public reading profile and a follow graph on
			the way — share what you read with the broader social web on your own terms.
		</li>
	</ul>
	<h2>On the wider web</h2>
	<p>
		The same library, connected to a wider reading community — without giving up where your data
		lives.
	</p>
	<ul>
		<li>
			A public reading profile that travels with your account, so people who know you can see what
			you read.
		</li>
		<li>
			Follow other readers, get notified about their updates, and see a side-by-side comparison of
			where your tastes overlap.
		</li>
		<li>
			Recommendations from your own reading history, with an opt-in pool to surface books that
			people like you enjoyed.
		</li>
		<li>
			Book clubs where members propose and vote on what to read next, with recurring rounds and
			shared reading lists.
		</li>
	</ul>
</ProjectPage>
