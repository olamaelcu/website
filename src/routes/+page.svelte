<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
</script>

<SEO
	title="Olamaelcu - A little software lab."
	description="Olamaelcu's all about making things — complete or not — that people can experiment with and understand."
	canonical="https://www.olamaelcu.net/"
	openGraphType="website"
	twitterCard="summary"
/>

<section class="lead">
	<h1>Welcome</h1>
	<p>
		Olamaelcu's all about making things &mdash; complete or not &mdash; that people can experiment
		with and understand. Each project comes with its own of story of genesis, its goal and what
		would make it be marked as <em>strong</em>.
	</p>
	<h2>The Mission</h2>
	<p>
		The goal is to take ideas that we're familiar with (and some novel) and release them for
		experimentation and simple everyday use. The users make up the community of people who finally
		get to develop the perspectives of the experience &mdash; the actual consumer.
	</p>
	<p class="cta">
		Sign up for <strong>alpha access</strong> at
		<a href="https://waitlist.olamaelcu.net?utm_source=landing" target="_blank"
			>waitlist.olamaelcu.net</a
		>.
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
		max-width: var(--content-3);
		margin: var(--wa-space-2xs) auto;
		padding: var(--wa-space-m);

		h1 {
			font-family: var(--font-display);
		}
	}

	h2 {
		margin-top: var(--wa-space-m);
	}

	p.cta {
		background-color: var(--wa-color-brand-on-normal);
		padding: var(--wa-space-s);
		text-align: center;
		border-radius: var(--wa-border-radius-m);
	}
</style>
