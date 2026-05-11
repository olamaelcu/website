<script lang="ts">
	import { resolve } from '$app/paths';
	import ProjectStatus, { STATUSES } from '$lib/components/projectStatus.svelte';

	const { data } = $props();

	const projectStatus = (name: string): string => {
		const project = data.projects.find((p: { name: string }) => p.name === name);
		return project?.status ?? STATUSES.INCUBATING;
	};
</script>

<svelte:head>
	<title>Projects | Olamaelcu</title>
	<meta name="description" content="Things I've built." />
</svelte:head>

<section>
	<h1>Projects</h1>
	<ul class="projects">
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
		max-width: 65ch;
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
	}
	.projects a {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto auto;
		gap: 0 var(--wa-space-xs);
		padding: var(--wa-space-m);
		border: 1px solid var(--link);
		border-radius: var(--wa-border-radius-m);
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
