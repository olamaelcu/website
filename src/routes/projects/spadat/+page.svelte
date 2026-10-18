<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import ProjectPage from '../ProjectPage.svelte';
	import { STATUSES } from '$lib/statuses';
	import { createQuery } from '@tanstack/svelte-query';

	const projectKey = 'spadat';
	const title = 'Spadat';

	const projectsQuery = createQuery(() => ({
		queryKey: ['projects'],
		queryFn: () => fetch('/data/projects.json').then((r) => r.json())
	}));

	let status = $derived(projectsQuery.data?.[projectKey]?.status ?? STATUSES.INCUBATING);
</script>

<SEO
	title="Spadat | Olamaelcu"
	description="A 4-player partnership Spades card game where every player helps shuffle the deck and every hand can be checked afterward — fair play, on the up-and-up."
	canonical="https://www.olamaelcu.net/projects/spadat"
	openGraphType="article"
	twitterCard="summary"
/>

<ProjectPage {title} {status} {projectKey}>
	<p>
		A 4-player online Spades card game where you and a partner go head-to-head against another pair
		— North/South versus East/West, bidding books and trying to hit your target before the other
		side does. Built mobile-first, with fairness baked into the deal itself: every player helps
		shuffle the deck, so no one can rig the cards.
	</p>
	<h2>What makes it different</h2>
	<p>
		Every hand uses a shuffle that all four players help create together, so nobody — not even the
		server — can rig the deal. After the hand finishes, the full record becomes public, which means
		anyone can double-check the game was on the up-and-up. The same rules engine runs on your phone
		and on the server, so what you see on screen is exactly what the server scores.
	</p>
	<h2>Rule options</h2>
	<p>Pick from several rule presets or customize nearly every detail:</p>
	<ul>
		<li>
			<strong>Standard</strong> — The classic version most people know. Nil bids allowed, 500 points to
			win.
		</li>
		<li>
			<strong>Tournament</strong> — Stricter timing and bidding. Great for competitive matches.
		</li>
		<li>
			<strong>NYC Rules</strong> — Street-style with jokers, faster games (first to 350), no nil bids.
		</li>
		<li>
			<strong>Casual</strong> — Relaxed rules for fun games with friends. No bag penalties, longer turn
			timers.
		</li>
		<li>
			<strong>Custom</strong> — Fine-tune everything from deck type to scoring rules.
		</li>
	</ul>
	<h2>What's heading next</h2>
	<p>The mobile build is the foundation. Here is what is on the way:</p>
	<ul>
		<li>A desktop build for Windows, macOS, and Linux, sharing the same rules engine as mobile.</li>
		<li>
			Cross-platform polish: matching controls, animations, and accessibility across phone and
			desktop.
		</li>
		<li>Spectator mode and full hand replay so anyone can review a finished game move by move.</li>
		<li>
			Achievements and leaderboards powered by the sister service, with the same public records
			underneath.
		</li>
	</ul>
</ProjectPage>
