<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	type Category = 'added' | 'fixed' | 'changed' | 'improved' | 'planned' | 'proposed';

	interface Entry {
		entry_date: string;
		category: Category;
		description: string;
		link_url?: string;
		link_label?: string;
	}

	let { projectKey } = $props<{
		projectKey: string;
	}>();

	const entriesQuery = createQuery(() => ({
		queryKey: ['roadmap', projectKey],
		queryFn: async () => {
			const r = await fetch(`/api/roadmap/${projectKey}`);
			if (!r.ok) throw new Error(`HTTP ${r.status}`);
			return r.json() as Promise<Entry[]>;
		},
		retry: false,
		refetchInterval: 1000 * 15
	}));

	let entries = $derived(entriesQuery.data ?? []);

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function isUpcoming(dateStr: string): boolean {
		return new Date(dateStr) > new Date();
	}

	function getCategoryClass(category: Category): string {
		return category;
	}
</script>

{#if entriesQuery.isLoading}
	<div class="changelog-loading">
		<wa-spinner></wa-spinner>
		<span>Loading roadmap...</span>
	</div>
{:else if entriesQuery.isError}
	<div class="changelog-error">
		<p>Failed to load roadmap.</p>
		<wa-button role="button" tabindex="0" onclick={() => entriesQuery.refetch()} onkeydown={(e: KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && entriesQuery.refetch()}>Retry</wa-button>
	</div>
{:else if entries.length > 0}
	<section class="changelog">
		<h2>Roadmap</h2>
		<ol class="timeline">
			{#each entries as entry, i}
				{@const upcoming = isUpcoming(entry.entry_date)}
				{@const latest = i === 0 && upcoming}
				<li class="entry" class:upcoming class:latest>
					<div class="dot"></div>
					<div class="content">
						<div class="meta">
							<time datetime={entry.entry_date}>{formatDate(entry.entry_date)}</time>
							<span class="badge {getCategoryClass(entry.category)}">{entry.category}</span>
						</div>
						<p class="description">{entry.description}</p>
						{#if entry.link_url && entry.link_label}
							<a href={entry.link_url} target="_blank" rel="noopener noreferrer" class="link">
								{entry.link_label}
							</a>
						{/if}
					</div>
				</li>
			{/each}
		</ol>
	</section>
{/if}

<style>
	.changelog {
		margin-top: var(--wa-space-l);
	}

	h2 {
		margin: var(--wa-space-l) 0 var(--wa-space-m);
		font-size: var(--text-base);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.timeline {
		list-style: none;
		padding: 0;
		position: relative;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 0.5rem;
		top: 0;
		bottom: 0;
		width: 2px;
		background: var(--wa-color-neutral-80);
	}

	@media (prefers-color-scheme: dark) {
		.timeline::before {
			background: var(--wa-color-neutral-60);
		}
	}

	.entry {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--wa-space-m);
		padding: var(--wa-space-s) 0 var(--wa-space-m) var(--wa-space-l);
		position: relative;
	}

	.dot {
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: var(--wa-color-neutral-50);
		border: 2px solid var(--wa-color-neutral-90);
		position: absolute;
		left: 0;
		top: 0.25rem;
		z-index: 1;
	}

	@media (prefers-color-scheme: dark) {
		.dot {
			border-color: var(--wa-color-neutral-40);
		}
	}

	.latest .dot {
		background: var(--wa-color-brand-80);
		border-color: var(--wa-color-brand-30);
	}

	@media (prefers-color-scheme: dark) {
		.latest .dot {
			background: var(--wa-color-brand-60);
			border-color: var(--wa-color-brand-05);
		}
	}

	.upcoming .dot {
		background: var(--wa-color-brand-80);
	}

	@media (prefers-color-scheme: dark) {
		.upcoming .dot {
			background: var(--wa-color-brand-60);
		}
	}

	.content {
		padding-bottom: var(--wa-space-s);
		position: relative;
		top: calc(-1 * var(--wa-space-m));
		left: var(--wa-space-s);
	}

	.meta {
		display: flex;
		align-items: center;
		gap: var(--wa-space-s);
		flex-wrap: wrap;
		margin-bottom: var(--wa-space-2xs);
	}

	time {
		font-family: var(--font-mono);
		font-size: var(--text-xs);
		opacity: 0.7;
	}

	.badge {
		padding: var(--wa-space-2xs) var(--wa-space-xs);
		border-radius: var(--wa-border-radius-m);
		font-size: var(--text-xs);
		font-family: var(--font-mono);
		text-transform: uppercase;
	}

	.added {
		background-color: var(--wa-color-success-80);
		color: var(--wa-color-success-30);
	}

	.fixed {
		background-color: var(--wa-color-danger-80);
		color: var(--wa-color-danger-30);
	}

	.changed {
		background-color: var(--wa-color-brand-80);
		color: var(--wa-color-brand-30);
	}

	.improved {
		background-color: var(--wa-color-brand-80);
		color: var(--wa-color-brand-30);
	}

	.planned {
		background-color: var(--wa-color-warning-80);
		color: var(--wa-color-warning-30);
	}

	.proposed {
		background-color: var(--wa-color-neutral-80);
		color: var(--wa-color-neutral-30);
	}

	@media (prefers-color-scheme: dark) {
		.added {
			background-color: var(--wa-color-success-60);
			color: var(--wa-color-success-05);
		}

		.fixed {
			background-color: var(--wa-color-danger-60);
			color: var(--wa-color-danger-05);
		}

		.changed {
			background-color: var(--wa-color-brand-60);
			color: var(--wa-color-brand-05);
		}

		.improved {
			background-color: var(--wa-color-brand-60);
			color: var(--wa-color-brand-05);
		}

		.planned {
			background-color: var(--wa-color-warning-60);
			color: var(--wa-color-warning-05);
		}

		.proposed {
			background-color: var(--wa-color-neutral-60);
			color: var(--wa-color-neutral-05);
		}
	}

	.description {
		margin: 0;
		font-size: var(--text-sm);
	}

	.link {
		display: inline-block;
		margin-top: var(--wa-space-2xs);
		font-size: var(--text-xs);
	}

	.changelog-loading,
	.changelog-error {
		display: flex;
		align-items: center;
		gap: var(--wa-space-s);
		padding: var(--wa-space-m) 0;
		font-size: var(--text-sm);
	}

	.changelog-error p {
		margin: 0;
		color: var(--wa-color-danger-80);
	}

	@media (prefers-color-scheme: dark) {
		.changelog-error p {
			color: var(--wa-color-danger-60);
		}
	}
</style>
