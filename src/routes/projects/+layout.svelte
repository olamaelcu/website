<script lang="ts">
	let { data, children } = $props();

	$effect(() => {
		if (data.seatCounts) {
			data.queryClient.setQueryData(['seat-counts'], data.seatCounts);
		}
	});
</script>

{@render children()}

<style>
	:global(main) {
		margin: 0 auto;
		max-width: 80vw;
	}
</style>
