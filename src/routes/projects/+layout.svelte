<script lang="ts">
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(main) {
		max-width: var(--size-content-3);
		margin: 0 auto;
		width: 100%;
	}
</style>
