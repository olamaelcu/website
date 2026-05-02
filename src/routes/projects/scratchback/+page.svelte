<script>
	import { MetaTags } from 'svelte-meta-tags';
	import ProjectStatus, { STATUSES } from '$lib/components/projectStatus.svelte';
</script>

<MetaTags
	title="Scratchback | Olamaelcu"
	description="Live services, game state synchronization and achievements for independent game developers and studios alike leveraging ATProto."
/>

<section class="lead">
	<h1>Scratchback</h1>
	<ProjectStatus status={STATUSES.INCUBATING} />
	<p>
		Live services, game state synchronization and achievements for indepenent game developers and
		studios alike leveraging <a href="https://atproto.com/?ref=olamaelcu" target="_blank">ATProto</a>.
	</p>
	<h2>Planned Features</h2>
	<ul>
		<li>
			Players provided with a means of reviewing their game history and a means of <strong
				>sharing gameplay experiences</strong
			>
		</li>
		<li>
			Games can leverage information from other titles in their warehouse to <strong
				>enrich gameplay experience</strong
			>
		</li>
		<li>Save information can be done incrementally and in a conflict-resistant way</li>
	</ul>
</section>
