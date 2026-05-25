<script lang="ts">
	import { resolve } from '$app/paths';
	import SEO from '$lib/components/SEO.svelte';
	import { SITE_URL } from '$lib/constants';
	import ProjectStatus from '$lib/components/projectStatus.svelte';
	import { STATUSES } from '$lib/statuses';

	const { data } = $props();

	const projectStatus = (name: string): string => {
		const project = data.projects.find((p: { name: string }) => p.name === name);
		return project?.status ?? STATUSES.INCUBATING;
	};
</script>

<SEO
	title="Projects | Olamaelcu"
	description="Things I've built."
	canonical={`${SITE_URL}/projects`}
	openGraphType="website"
	ogImage={`${SITE_URL}/og-default.png`}
	twitterImage={`${SITE_URL}/og-default.png`}
/>

<section>
	<h1>Projects</h1>
	<ul class="projects">
		<li>
			<a href={resolve('/projects/spadat')}>
				<strong>Spadat</strong>
				<span>4-player Spades card game with verifiable matches via AT Protocol</span>
				<ProjectStatus status={projectStatus('spadat')} />
			</a>
		</li>
		<li>
			<a href={resolve('/projects/scratchback')}>
				<strong>Scratchback</strong>
				<span>Game state sync and achievements via ATProto for developers</span>
				<ProjectStatus status={projectStatus('scratchback')} />
			</a>
		</li>
		<li>
			<a href={resolve('/projects/beats')}>
				<strong>Beats</strong>
				<span>Music curation from your social graph</span>
				<ProjectStatus status={projectStatus('beats')} />
			</a>
		</li>
		<li>
			<a href={resolve('/projects/livtet')}>
				<strong>Livtet</strong>
				<span>Local-first, ATProto-friendly book management</span>
				<ProjectStatus status={projectStatus('livtet')} />
			</a>
		</li>
	</ul>
</section>

<style>
	section {
		margin: 0 auto;
	}
	h1 {
		font-family: var(--font-display);
		margin-top: var(--wa-space-xs);
		text-align: center;
	}
	.projects {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: var(--wa-space-m);
	}
	.projects li {
		margin: 0;
		padding: 0;
		box-shadow: var(--wa-shadow-s);
	}
	.projects a {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto;
		gap: 0 var(--wa-space-xs);
		padding: var(--wa-space-m);
		border: 1px solid var(--link);
		text-decoration: none;
	}
	.projects strong {
		grid-column: 1;
		grid-row: 1;
	}
	.projects span {
		grid-column: 1;
		grid-row: 2;
		font-size: var(--text-sm);
		opacity: 0.7;
	}
	.projects :global(.project-status) {
		grid-column: 2;
		grid-row: 1 / span 2;
		align-self: center;
	}
</style>
