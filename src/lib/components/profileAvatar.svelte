<script lang="ts">
	import { createProfileQuery } from '@olamaelcu/atproto-svelte/client';

	interface Props {
		did: string;
		size?: number;
		onFail?: () => void;
	}

	let { did, size = 24, onFail }: Props = $props();

	const query = createProfileQuery(did);

	$effect(() => {
		if (query.isError && onFail) {
			onFail();
		}
	});

	function getInitials(handle: string): string {
		const parts = handle.split('.');
		const username = parts[0] || handle;
		return username.slice(0, 2).toUpperCase();
	}

	function getColorFromDid(did: string): string {
		let hash = 0;
		for (let i = 0; i < did.length; i++) {
			hash = did.charCodeAt(i) + ((hash << 5) - hash);
		}
		const hue = hash % 360;
		return `hsl(${hue}, 60%, 45%)`;
	}
</script>

{#if query.isPending}
	<span
		class="avatar avatar-loading"
		style="width: {size}px; height: {size}px;"
		aria-label="Loading profile"
	></span>
{:else if query.error}
	<span
		class="avatar avatar-error"
		style="width: {size}px; height: {size}px; font-size: {size * 0.4}px;"
		aria-label="Profile unavailable"
	>
		{#if query.data}
			{getInitials(query.data.handle)}
		{/if}
	</span>
{:else if query.data}
	{#if query.data.avatar}
		<img
			src={query.data.avatar}
			alt={query.data.displayName || query.data.handle}
			class="avatar"
			style="width: {size}px; height: {size}px;"
			onerror={(e) => {
				const target = e.target as HTMLImageElement;
				target.style.display = 'none';
				const fallback = target.nextElementSibling as HTMLElement;
				if (fallback) {
					fallback.style.display = 'flex';
				}
			}}
		/>
		<span
			class="avatar avatar-fallback"
			style="width: {size}px; height: {size}px; display: none; background-color: {getColorFromDid(
				did
			)};"
		>
			{getInitials(query.data.handle)}
		</span>
	{:else}
		<span
			class="avatar avatar-fallback"
			style="width: {size}px; height: {size}px; background-color: {getColorFromDid(did)};"
		>
			{getInitials(query.data.handle)}
		</span>
	{/if}
{/if}

<style>
	.avatar {
		display: inline-block;
		border-radius: 50%;
		object-fit: cover;
		vertical-align: middle;
		flex-shrink: 0;
		margin-left: 0.25rem;
	}

	.avatar-loading {
		background-color: #e0e0e0;
		animation: pulse 1.5s ease-in-out infinite;
	}

	.avatar-error {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background-color: #ff6b6b;
		color: white;
		font-weight: 600;
	}

	.avatar-fallback {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: 600;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.6;
		}
		50% {
			opacity: 1;
		}
	}
</style>
