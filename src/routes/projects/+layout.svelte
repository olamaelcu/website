<script lang="ts">
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(main) {
		margin: 0 auto;
		max-width: 80vw;
	}
</style>
