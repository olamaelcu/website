<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	interface SeatCount {
		seatsTaken: number;
		maxSeats: number | null;
	}

	interface Props {
		projectKey: string;
	}

	let { projectKey }: Props = $props();

	const seatCountsQuery = createQuery(() => ({
		queryKey: ['seat-counts'],
		queryFn: () => fetch('/api/seat-counts').then((r) => r.json()),
		refetchInterval: 5000
	}));

	let seatData = $derived<SeatCount>(
		seatCountsQuery.data?.[projectKey] ?? { seatsTaken: 0, maxSeats: null }
	);
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