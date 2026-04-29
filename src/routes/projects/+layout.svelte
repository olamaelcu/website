<script lang="ts">
	import ProjectNav from '$lib/components/projectNav.svelte';

	let { children } = $props();
</script>

<ProjectNav />

{@render children()}

<style>
	:global(main) {
		margin: 0 auto;
		width: 80vw;
		flex-direction: column;
	}
</style>
