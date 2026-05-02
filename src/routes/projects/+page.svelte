<script lang="ts">
	import { resolve } from '$app/paths';
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
				<span>Game state sync and achievements via ATProto</span>
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
		margin-top: 0.5rem;
	}
	.projects {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.projects a {
		display: block;
		padding: 1rem;
		border: 1px solid var(--surface-2);
		border-radius: 0.5rem;
		text-decoration: none;
	}
	.projects a:hover {
		border-color: var(--surface-3);
	}
	.projects strong {
		display: block;
		margin-bottom: 0.25rem;
	}
	.projects span {
		font-size: 0.875rem;
		opacity: 0.7;
	}
</style>
