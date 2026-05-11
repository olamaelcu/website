<script lang="ts">
	import { onNavigate, afterNavigate } from '$app/navigation';

	let visible = $state(false);
	let progress = $state(0);
	let fading = $state(false);

	let showTimer: ReturnType<typeof setTimeout> | undefined;
	let hideTimer: ReturnType<typeof setTimeout> | undefined;

	function startLoading() {
		clearTimeout(showTimer);
		clearTimeout(hideTimer);
		fading = false;
		progress = 0;
		visible = true;

		// Small delay before showing to avoid flash on fast navigations
		showTimer = setTimeout(() => {
			progress = 90;
		}, 200);
	}

	function finishLoading() {
		// Snap to 100%
		progress = 100;
		fading = true;

		// Fade out and hide after transition
		hideTimer = setTimeout(() => {
			visible = false;
			progress = 0;
			fading = false;
		}, 200);
	}

	onNavigate(() => {
		startLoading();
	});

	afterNavigate(() => {
		finishLoading();
	});
</script>

<div
	class="page-loader"
	class:visible
	class:fading
	style:--progress={progress + '%'}
	style:--brand-color="var(--wa-color-brand, var(--link))"
>
	<div class="bar"></div>
</div>

<style>
	.page-loader {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		z-index: 9999;
		pointer-events: none;
		opacity: 0;
		transition: opacity 200ms ease-out;
	}

	.page-loader.visible {
		opacity: 1;
	}

	.page-loader.fading {
		opacity: 0;
	}

	.bar {
		height: 100%;
		width: var(--progress);
		background-color: var(--brand-color);
		transition: width 300ms ease-out;
	}

	.page-loader.fading .bar {
		transition: none;
	}
</style>
