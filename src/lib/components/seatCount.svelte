<script lang="ts">
	interface SeatCount {
		seatsTaken: number;
		maxSeats: number | null;
	}

	interface Props {
		projectKey: string;
	}

	let { projectKey }: Props = $props();

	let seatData = $state<SeatCount>({ seatsTaken: 0, maxSeats: null });

	$effect(() => {
		let interval: ReturnType<typeof setInterval>;

		async function fetchSeatCounts() {
			try {
				const res = await fetch('/api/seat-counts');
				if (res.ok) {
					const data: Record<string, SeatCount> = await res.json();
					seatData = data[projectKey] ?? { seatsTaken: 0, maxSeats: null };
				}
			} catch {
				// silently fail, keep default values
			}
		}

		fetchSeatCounts();
		interval = setInterval(fetchSeatCounts, 30000);

		return () => clearInterval(interval);
	});

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