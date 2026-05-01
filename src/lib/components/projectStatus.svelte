<script lang="ts" module>
	export enum STATUSES {
		INCUBATING = 'incubate',
		ALPHA = 'alpha',
		BETA = 'beta',
		RELEASE = 'rc'
	}
</script>

<script lang="ts">
	const { status = STATUSES.INCUBATING } = $props();

	let label = $state();
	$effect(() => {
		switch (status) {
			case STATUSES.INCUBATING:
				label = 'Incubating';
				break;
			case STATUSES.ALPHA:
				label = 'Closed Alpha';
				break;
			case STATUSES.BETA:
				label = 'Public Beta';
				break;
			case STATUSES.RELEASE:
				label = 'General Availabilty';
				break;
		}
	});
</script>

<span>{label}</span>

<style>
	span {
		padding: var(--size-2);
		margin: 0 var(--size-1);
		text-transform: uppercase;
		font-family: var(--font-mono);
	}
</style>
