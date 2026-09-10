import { browser } from '$app/environment';

const PLAUSIBLE_HOST = 'https://analytics.olamaelcu.net';
const PLAUSIBLE_SCRIPT_SRC = `${PLAUSIBLE_HOST}/js/pa-TTVv8bb2GLT0YqfR7pxuF.js`;

let injected = false;

export function initPlausible() {
	if (!browser || injected) return;
	injected = true;

	const script = document.createElement('script');
	script.async = true;
	script.src = PLAUSIBLE_SCRIPT_SRC;
	document.head.appendChild(script);

	const shim = document.createElement('script');
	shim.text =
		'window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()';
	document.head.appendChild(shim);
}

export function trackEvent(eventName: string, props?: Record<string, unknown>) {
	if (typeof window !== 'undefined' && (window as any).plausible) {
		(window as any).plausible(eventName, { props });
	}
}
