<script>
	import { resolve } from '$app/paths';
</script>

<nav>
	<span>Projects</span>
	<a href={resolve('/projects/scratchback')}>Scratchback</a>
	<a href={resolve('/projects/beats')}>Beats</a>
	<a href={resolve('/projects/livtet')}>Livtet</a>
</nav>

<style>
	nav {
		max-width: var(--content-2);
		margin: var(--wa-space-2xs) auto;
		span {
			text-transform: uppercase;
		}

		a {
			padding: 0 var(--wa-space-2xs);
		}
	}
</style>
