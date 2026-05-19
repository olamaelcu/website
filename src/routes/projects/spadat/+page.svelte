<script lang="ts">
	import SEO from '$lib/components/SEO.svelte';
	import ProjectPage from '../ProjectPage.svelte';
	import { STATUSES } from '$lib/statuses';
	import { createQuery } from '@tanstack/svelte-query';

	const projectKey = 'spadat';
	const title = 'Spadat';

	const projectsQuery = createQuery(() => ({
		queryKey: ['projects'],
		queryFn: () => fetch('/api/projects').then((r) => r.json())
	}));

	let status = $derived(projectsQuery.data?.[projectKey]?.status ?? STATUSES.INCUBATING);
</script>

<SEO
	title="Spadat | Olamaelcu"
	description="A 4-player partnership Spades card game built on the AT Protocol"
	canonical="https://www.olamaelcu.net/projects/spadat"
	openGraphType="article"
	twitterCard="summary"
/>

<ProjectPage {title} {status} {projectKey}>
	<p>
		A 4-player online Spades card game. Find a partner, pick your rules, and play matches where
		everyone can verify the results were fair. Built with <a
			href="https://godot-rust.github.io/">Godot and Rust</a
		>.
	</p>
	<p>
		What makes it different: every hand uses a shuffle that all 4 players help create — no one can
		rig the deal. After each hand, the full record becomes public so anyone can double-check the
		game was on the up-and-up.
	</p>
	<h2>How to Play</h2>
	<p>
		Join a lobby with 3 friends. Partners sit across from each other — North/South versus East/West.
		Bid how many tricks you'll take, then play cards trying to win tricks. Your partnership's
		combined bid determines your target. First to 500 points (or whatever the host sets) wins.
	</p>
	<h2>Rule Options</h2>
	<p>
		Pick from several rule presets or customize nearly every detail:
	</p>
	<ul>
		<li>
			<strong>Standard</strong> — The classic version most people know. Nil bids allowed, 500 points
			to win.
		</li>
		<li>
			<strong>Tournament</strong> — Stricter timing and bidding. Great for competitive matches.
		</li>
		<li>
			<strong>NYC Rules</strong> — Street-style with jokers, faster games (first to 350), and
			no nil bids allowed.
		</li>
		<li>
			<strong>Casual</strong> — Relaxed rules for fun games with friends. No bag penalties, longer
			turn timers.
		</li>
		<li>
			<strong>Custom</strong> — Fine-tune everything from deck type to scoring rules.
		</li>
	</ul>
	<h2>Platforms</h2>
	<p>Built for mobile first — coming to Android and iOS. Desktop support planned for Windows, macOS, and Linux.</p>
	<h2>Fair Play</h2>
	<p>
		The deck gets shuffled using randomness from all 4 players plus the server. Each player contributes
		a secret random number, and only after everyone commits their hash do the numbers get revealed.
		This means no single player can control the deal. After the hand finishes, the complete game
		record becomes public — seeds, deck order, every play — so anyone can independently verify the
		game was fair.
	</p>
</ProjectPage>
