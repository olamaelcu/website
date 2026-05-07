<script lang="ts">
	import { page } from '$app/stores';

	interface Props {
		projectKey: string;
	}

	let { projectKey }: Props = $props();

	// @ts-ignore - $page.data lacks type info
	let seatCounts = $derived($page.data.seatCounts as Record<string, { seatsTaken: number; maxSeats: number | null } | undefined>);
	let seatData = $derived(seatCounts?.[projectKey] ?? { seatsTaken: 0, maxSeats: null });
	let displayText = $derived(
		seatData.maxSeats !== null
			? `${seatData.seatsTaken}/${seatData.maxSeats} seats claimed`
			: `${seatData.seatsTaken} seats claimed`
	);
</script>

<small class="seat-count">{displayText}</small>

<style>
	.seat-count {
		font-family: var(--wa-font-mono, monospace);
		font-size: var(--wa-text-sm, 0.875rem);
		color: var(--wa-color-text-secondary, inherit);
	}
</style>