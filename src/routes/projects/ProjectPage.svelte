<script lang="ts">
	import ProjectStatus from '$lib/components/projectStatus.svelte';
	import SeatCount from '$lib/components/seatCount.svelte';
	import Changelog from './Changelog.svelte';

	let { title, status, projectKey, children } = $props<{
		title: string;
		status: string;
		projectKey: string;
		children: any;
	}>();
</script>

<section class="lead">
	<div class="title-row">
		<h1>{title}</h1>
		<ProjectStatus {status} />
		<SeatCount {projectKey} />
	</div>
	{@render children()}
	<Changelog {projectKey} />
</section>

<style>
	.title-row {
		display: flex;
		align-items: center;
		justify-content: space-around;
		gap: var(--wa-space-s);
		flex-wrap: wrap;
		flex-direction: column;
		margin-bottom: var(--wa-space-m);

		h1 {
			margin-bottom: 0;
			flex: 1 1;
		}

		@media (width >= 40rem) {
			& {
				flex-direction: row;
			}
		}
	}

	h1 {
		font-family: var(--font-display);
		margin-top: var(--wa-space-xs);
		text-align: center;
	}
	section.lead {
		padding: var(--wa-space-m);
	}
</style>
