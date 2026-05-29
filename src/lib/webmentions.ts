export interface WebmentionAuthor {
	type: 'card';
	name?: string;
	url?: string;
	photo?: string;
}

export interface WebmentionContent {
	text?: string;
	html?: string;
}

export interface Webmention {
	type: 'entry';
	author?: WebmentionAuthor;
	url: string;
	published?: string;
	'wm-received'?: string;
	'wm-id': number;
	'wm-property'?: string;
	'wm-source'?: string;
	content?: WebmentionContent;
}

export interface WebmentionFeed {
	type: 'feed';
	name: string;
	children: Webmention[];
}

export async function fetchWebmentions(target: string): Promise<Webmention[]> {
	const url = `https://webmention.io/api/mentions.jf2?target=${encodeURIComponent(target)}`;

	try {
		const response = await fetch(url, {
			headers: { Accept: 'application/json' }
		});

		if (!response.ok) {
			console.error('Failed to fetch webmentions:', response.statusText);
			return [];
		}

		const data: WebmentionFeed = await response.json();
		return data.children ?? [];
	} catch (error) {
		console.error('Error fetching webmentions:', error);
		return [];
	}
}

export async function sendWebmention(source: string, target: string): Promise<boolean> {
	try {
		const endpointResponse = await fetch(target, {
			headers: { Accept: 'application/xhtml+xml, text/html' }
		});

		const html = await endpointResponse.text();
		const match = html.match(/<link[^>]+rel=["'](?:webmention|me)["'][^>]+href=["']([^"']+)["']/i);

		if (!match) {
			console.error('No webmention endpoint found on target page');
			return false;
		}

		const endpoint = match[1];

		const webmentionResponse = await fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `source=${encodeURIComponent(source)}&target=${encodeURIComponent(target)}`
		});

		return webmentionResponse.ok;
	} catch (error) {
		console.error('Error sending webmention:', error);
		return false;
	}
}
