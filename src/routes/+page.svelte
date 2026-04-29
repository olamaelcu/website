<script>
	import ProjectNav from '$lib/components/projectNav.svelte';
</script>

<ProjectNav />

<section class="lead">
	<h1>Projects</h1>
	<p>
		Olamaelcu's all about making things &mdash; complete or not &mdash; that people can experiment
		with and understand.
	</p>
	<h2>Mission</h2>
	<p>
		The goal is to take ideas that we're familiar with and some novel and aim to release them for
		experimentation and eventual productization. The user community is the one who gets to develop
		the perspectives of the experience &mdash; the actual consumer.
	</p>
</section>

<style>
	section.lead {
		flex: 1 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		max-width: var(--size-content-3);
		margin: var(--size-1) auto;
		padding: var(--size-4);

		h1 {
			font-family: var(--font-display);
		}
	}

	h2 {
		margin-top: var(--size-3);
	}
</style>
