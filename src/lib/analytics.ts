import { initPlausible } from '../hooks.client';

export interface ClickEventProps {
	text: string;
	href: string | null;
	outbound: boolean;
}

function isOutbound(href: string | null): boolean {
	if (!href) return false;
	try {
		const url = new URL(href, window.location.origin);
		return url.origin !== window.location.origin;
	} catch {
		return false;
	}
}

async function getTracker() {
	if (typeof document === 'undefined') return null;
	await initPlausible();
	const { track } = await import('@plausible-analytics/tracker');
	return track;
}

export async function trackClick(event: MouseEvent): Promise<void> {
	if (typeof document === 'undefined') return;

	const target = event.target as HTMLElement | null;
	if (!target || target.nodeType === Node.TEXT_NODE) return;

	const anchor = target.closest('a');
	const href = anchor?.getAttribute('href') ?? undefined;
	const text = target.textContent?.trim() ?? '';

	const track = await getTracker();
	track?.('click', {
		props: { text, href: href ?? '', outbound: isOutbound(href ?? null) ? 'true' : 'false' }
	});
}

export async function trackCommit(commit: string | undefined): Promise<void> {
	if (typeof window === 'undefined') return;
	const track = await getTracker();
	track?.('commit', {
		props: commit !== undefined ? { commit } : {}
	});
}

let outboundTrackingEnabled = false;

export function enableOutboundTracking(): void {
	if (typeof document === 'undefined' || outboundTrackingEnabled) return;
	outboundTrackingEnabled = true;

	document.addEventListener('click', async (e: MouseEvent) => {
		const target = e.target as HTMLElement | null;
		if (!target) return;
		const anchor = target.closest('a');
		if (!anchor) return;
		const href = anchor.getAttribute('href');
		if (!href) return;
		if (isOutbound(href)) {
			const track = await getTracker();
			track?.('outbound', { props: { href } });
		}
	});
}
