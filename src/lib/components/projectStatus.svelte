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
	let colorClass = $state('');
	$effect(() => {
		switch (status) {
			case STATUSES.INCUBATING:
				label = 'Incubating';
				colorClass = 'incubating';
				break;
			case STATUSES.ALPHA:
				label = 'Closed Alpha';
				colorClass = 'alpha';
				break;
			case STATUSES.BETA:
				label = 'Public Beta';
				colorClass = 'beta';
				break;
			case STATUSES.RELEASE:
				label = 'General Availabilty';
				colorClass = 'release';
				break;
		}
	});
</script>

<span class="project-status {colorClass}">{label}</span>

<style>
	span {
		padding: var(--wa-space-xs) var(--wa-space-s);
		margin: 0 var(--wa-space-2xs);
		text-transform: uppercase;
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		border-radius: var(--wa-border-radius-m);
		align-self: center;
	}

	.incubating {
		background-color: var(--wa-color-purple-80);
		color: var(--wa-color-neutral-05);
	}

	.alpha {
		background-color: var(--wa-color-warning-80);
		color: var(--wa-color-warning-30);
	}

	.beta {
		background-color: var(--wa-color-blue-80);
		color: var(--wa-color-blue-30);
	}

	.release {
		background-color: var(--wa-color-success-80);
		color: var(--wa-color-success-30);
	}

	@media (prefers-color-scheme: dark) {
		.incubating {
			background-color: var(--wa-color-neutral-40);
			color: var(--wa-color-neutral-95);
		}

		.alpha {
			background-color: var(--wa-color-warning-60);
			color: var(--wa-color-warning-05);
		}

		.beta {
			background-color: var(--wa-color-blue-60);
			color: var(--wa-color-blue-05);
		}

		.release {
			background-color: var(--wa-color-success-60);
			color: var(--wa-color-success-05);
		}
	}
</style>
