<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import ProjectStatus, { STATUSES } from '$lib/components/projectStatus.svelte';
	import SeatCount from '$lib/components/seatCount.svelte';
	import ProfileAvatar from '$lib/components/profileAvatar.svelte';
</script>

<MetaTags
	title="Beats | Olamaelcu"
	description="An experiment in music curation from those who you follow in the Atmosphere, exclusively for Blacksky."
/>

<section class="lead">
	<div class="title-row">
		<h1>Beats</h1>
		<ProjectStatus status={STATUSES.INCUBATING} />
	</div>
	<SeatCount projectKey="beats" />
	<p>
		An experiment in music curation from those who you follow in the Atmosphere, <strong
			>exclusively for <a href="https://www.blackskyweb.xyz/?ref=olamaelcu">Blacksky</a></strong
		>.
	</p>
	<h2>Planned Features</h2>
	<ul>
		<li>Curate a list of people you follow to see their music updates.</li>
		<li>Connect with existing media services to help syndicate your listening history.</li>
		<li>
			In honor of <a
				href="https://www.refinery29.com/en-us/2020/12/10208481/jewel-ham-artist-spotify-wrapped-internship?ref=olamaelcu"
				>the Black woman who invented <strong>Spotify Wrapped</strong></a
			>
			concept, one can share and create a <strong>Jeweled List</strong> post once a month, season or
			year. Thank you
			<a href="https://www.whateverjewel.world/?ref=olamaelcu">Jewel Ham</a>.
		</li>
	</ul>
	<h2>Credit</h2>
	<p>
		Thanks to
		<span class="user-link">
			<ProfileAvatar did="did:plc:w3vda6vzfsi6xa5acotbavzx" size={20} />
			<a href="https://blacksky.community/profile/did:plc:w3vda6vzfsi6xa5acotbavzx/"
				>@jeniusj.blacksky.app</a
			>
		</span>
		and
		<span class="user-link">
			<ProfileAvatar did="did:plc:mqplt3ok3pc5h4y3ce3wz4o5" size={20} />
			<a href="https://blacksky.community/profile/did:plc:mqplt3ok3pc5h4y3ce3wz4o5"
				>@tre.blacksky.app</a
			>
		</span>
		for demonstrating some community-driven ways of doing this (see
		<a href="https://blacksky.community/profile/did:plc:w3vda6vzfsi6xa5acotbavzx/feed/aaalsseq2jigy"
			>@jeniusj.blacksky.app's feed</a
		>).
	</p>
</section>
