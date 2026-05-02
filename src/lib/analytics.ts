import Plausible from 'plausible-tracker';

const { trackEvent, enableAutoOutboundTracking } = Plausible({
	domain: 'olamaelcu.net'
});

enableAutoOutboundTracking();

function isOutbound(href: string | null): boolean {
	if (!href) return false;
	try {
		const url = new URL(href, window.location.origin);
		return url.origin !== window.location.origin;
	} catch {
		return false;
	}
}

export interface ClickEventProps {
	text: string;
	href: string | null;
	outbound: boolean;
}

export function trackClick(event: MouseEvent): void {
	const target = event.target as HTMLElement | null;
	if (!target || target.nodeType === Node.TEXT_NODE) return;

	const anchor = target.closest('a');
	const href = anchor?.getAttribute('href') ?? undefined;
	const text = target.textContent?.trim() ?? '';

	trackEvent('click', { props: { text, href: href ?? '', outbound: isOutbound(href ?? null) } });
}

export { trackEvent };
