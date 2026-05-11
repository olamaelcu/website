<script lang="ts">
	let { children } = $props();
</script>

{@render children()}

<style>
	:global(main) {
		margin: 0 auto;
		max-width: 80vw;
	}
	:global(.title-row) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--wa-space-s);
		flex-wrap: wrap;
		margin-bottom: var(--wa-space-m);
	}
	:global(.title-row h1) {
		margin-bottom: 0;
	}
</style>
