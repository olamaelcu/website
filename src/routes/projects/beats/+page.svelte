<script lang="ts">
	import { MetaTags } from 'svelte-meta-tags';
	import ProjectStatus, { STATUSES } from '$lib/components/projectStatus.svelte';
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
		Thanks to <a href="https://blacksky.community/profile/did:plc:w3vda6vzfsi6xa5acotbavzx/"
			>@jeniusj.blacksky.app</a
		>
		and
		<a
			href="https://blacksky.community/profile/did:plc:r4ubfvtnwl2inh3c3dmuiqck/post/3mas2ew7xx22o/"
			>@tre.blacksky.app</a
		>
		for demonstrating some community-driven ways of doing this (see
		<a href="https://blacksky.community/profile/did:plc:w3vda6vzfsi6xa5acotbavzx/feed/aaalsseq2jigy"
			>@jeniusj.blacksky.app's feed</a
		>).
	</p>
</section>
