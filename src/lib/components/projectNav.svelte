<script>
	import { resolve } from '$app/paths';
</script>

<nav>
	<span>Projects</span>
	<a href={resolve('/projects/scratchback')}>Scratchback</a>
	<!-- <a href={resolve('/projects/wotb')}>WOTB</a> -->
	<!-- <a href={resolve('/projects/livtet')}>Livtet</a> -->
</nav>

<style>
	nav {
		max-width: var(--size-content-2);
		margin: var(--size-1) auto;
		span {
			text-transform: uppercase;
		}

		a {
			padding: 0 var(--size-1);
		}
	}
</style>
