<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import { SITE_URL } from '$lib/constants';
</script>

<SEO
	title="Olamaelcu - A little software lab."
	description="Olamaelcu's all about making things — complete or not — that people can experiment with and understand."
	canonical={`${SITE_URL}/`}
	openGraphType="website"
	twitterCard="summary"
	ogImage={`${SITE_URL}/og-default.png`}
	twitterImage={`${SITE_URL}/og-default.png`}
/>

<img
	src="/banner.jpg"
	class="banner"
	alt="A pair of glasses, pen and two open notebooks in black and white"
/>
<section class="lead">
	<h1>Welcome</h1>
	<p>
		Olamaelcu's all about making things &mdash; complete or not &mdash; that people can experiment
		with and understand. Each project comes with its own story of genesis, its goal and what would
		make it be marked as <em>strong</em>.
	</p>
	<h2>The Mission</h2>
	<p>
		The goal is to take ideas that we're familiar with (and some novel) and release them for
		experimentation and simple everyday use. The users make up the community of people who finally
		get to develop the perspectives of the experience &mdash; the actual consumer.
	</p>
	<h2>Support</h2>
	<p>
		Help out by testing out <a href="https://waitlist.olamaelcu.net">the new projects</a>, funding
		it on <a href="/about/support">a donation basis</a> and spreading the word!
	</p>
	<p class="cta">
		Sign up for <strong>alpha access</strong> at
		<a href="https://waitlist.olamaelcu.net?utm_source=landing" target="_blank"
			>waitlist.olamaelcu.net</a
		>
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
		background-color: var(--wa-color-brand);
		color: var(--wa-color-brand-on);
		padding: var(--wa-space-s);
		text-align: center;
		border-radius: var(--wa-border-radius-m);
		box-shadow: var(--wa-shadow-m);
		a {
			color: inherit;
		}
	}

	img.banner {
		height: 20rem;
		object-position: center center;
		object-fit: cover;

		@media (width >= 40rem) {
			& {
				height: 30rem;
			}
		}
	}
</style>
