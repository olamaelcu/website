<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import ProjectPage from '../ProjectPage.svelte';
	import { STATUSES } from '$lib/statuses';
	import ProfileAvatar from '$lib/components/profileAvatar.svelte';
	import { createQuery } from '@tanstack/svelte-query';

	const failedDids = $state(new Set<string>());

	function handleFail(did: string) {
		failedDids.add(did);
	}

	const projectKey = 'beats';
	const title = 'Beats';

	const projectsQuery = createQuery(() => ({
		queryKey: ['projects'],
		queryFn: () => fetch('/data/projects.json').then((r) => r.json())
	}));

	let status = $derived(projectsQuery.data?.[projectKey]?.status ?? STATUSES.ALPHA);
</script>

<SEO
	title="Beats"
	description="A music feed for the open social web, built so the people you follow become how you discover what to listen to next."
	canonical="https://www.olamaelcu.net/projects/beats"
	openGraphType="article"
	twitterCard="summary_large_image"
/>

<ProjectPage {title} {status} {projectKey}>
	<p>
		Beats turns who you follow into a music feed. Sign in with your existing identity on the open
		social web, anchored first in the Blacksky community, and your timeline starts surfacing what
		the people around you are playing. Share a track, and it finds the people who care.
	</p>
	<h2>Three ways to listen in</h2>
	<p>
		Beats gives you three feeds instead of one firehose. The first collects your own music shares;
		the second narrows to a hand-picked set of the people you follow; the third opens up to everyone
		you follow. You decide how wide the room gets.
	</p>
	<h2>Your playlists, posted for you</h2>
	<p>
		Connect Spotify, Apple Music, or Plex and Beats watches for new additions, posting a track to
		your playlist feed the moment you save it. Apple Music runs in the background today; a fuller
		connect experience is on the way. Tidal groundwork is in place; the connection itself is not
		live yet. In honor of
		<a
			href="https://www.refinery29.com/en-us/2020/12/10208481/jewel-ham-artist-spotify-wrapped-internship?ref=olamaelcu"
			>the Black woman who invented the concept of <strong>Spotify Wrapped</strong></a
		>
		one can share and create a <strong>Jeweled List</strong> post once a month, season or year.
		Thank you <a href="https://www.whateverjewel.world/?ref=olamaelcu">Jewel Ham</a>.
	</p>
	<h2>Where Beats is heading</h2>
	<p>The foundation is shipping. Here is what comes next.</p>
	<ul>
		<li>Open up a full connect flow for Apple Music, not just background listening.</li>
		<li>Bring Tidal online so its plays show up alongside the rest.</li>
		<li>
			Grow shared-link discovery: seeing who else posted the same track reaches more music services.
		</li>
		<li>
			Hand more control to the community, with opt-outs and moderator tools shaped by the people
			using it.
		</li>
	</ul>

	<h2>Credit</h2>
	<p>
		Thanks to
		<span
			class="user-link"
			class:user-link-failed={failedDids.has('did:plc:w3vda6vzfsi6xa5acotbavzx')}
		>
			<ProfileAvatar
				did="did:plc:w3vda6vzfsi6xa5acotbavzx"
				size={20}
				onFail={() => handleFail('did:plc:w3vda6vzfsi6xa5acotbavzx')}
			/>
			<a href="https://blacksky.community/profile/did:plc:w3vda6vzfsi6xa5acotbavzx/"
				>@jeniusj.blacksky.app</a
			>
		</span>,
		<span
			class="user-link"
			class:user-link-failed={failedDids.has('did:plc:usheh7mu2uypezyl4disq2ql')}
		>
			<ProfileAvatar
				did="did:plc:usheh7mu2uypezyl4disq2ql"
				size={20}
				onFail={() => handleFail('did:plc:usheh7mu2uypezyl4disq2ql')}
			/>
			<a href="https://blacksky.community/profile/chillarybanks.com">@chillarybanks.com</a>
		</span>
		and
		<span
			class="user-link"
			class:user-link-failed={failedDids.has('did:plc:mqplt3ok3pc5h4y3ce3wz4o5')}
		>
			<ProfileAvatar
				did="did:plc:mqplt3ok3pc5h4y3ce3wz4o5"
				size={20}
				onFail={() => handleFail('did:plc:mqplt3ok3pc5h4y3ce3wz4o5')}
			/>
			<a href="https://blacksky.community/profile/did:plc:mqplt3ok3pc5h4y3ce3wz4o5"
				>@tre.blacksky.app</a
			>
		</span>
		for demonstrating some community-driven ways of doing this (see
		<a href="https://blacksky.community/profile/did:plc:w3vda6vzfsi6xa5acotbavzx/feed/aaalsseq2jigy"
			>@jeniusj.blacksky.app's feed</a
		>).
	</p>
</ProjectPage>
