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
		queryFn: () => fetch('/api/projects').then((r) => r.json())
	}));

	let status = $derived(projectsQuery.data?.[projectKey]?.status ?? STATUSES.ALPHA);
</script>

<SEO
	title="Beats"
	description="An experiment in music curation from those who you follow in the Atmosphere, exclusively for Blacksky."
	canonical="https://www.olamaelcu.net/projects/beats"
	openGraphType="article"
	twitterCard="summary_large_image"
/>

<ProjectPage {title} {status} {projectKey}>
	<p>
		An experiment in music curation of one's own music taste and from those who you follow in the
		Atmosphere, <strong
			>exclusively for <a href="https://www.blackskyweb.xyz/?utm_source=olamaelcu">Blacksky</a
			></strong
		>.
	</p>
	<h2>Planned Features</h2>
	<ul>
		<li>Build up a feed of your music-related posts to share on Blacksky.</li>
		<li>Curate a list of people you follow to see their music updates.</li>
		<li>
			In honor of <a
				href="https://www.refinery29.com/en-us/2020/12/10208481/jewel-ham-artist-spotify-wrapped-internship?ref=olamaelcu"
				>the Black woman who invented the concept of <strong>Spotify Wrapped</strong></a
			>
			one can share and create a <strong>Jeweled List</strong> post once a month, season or year.
			Thank you
			<a href="https://www.whateverjewel.world/?ref=olamaelcu">Jewel Ham</a>.
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
