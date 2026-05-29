import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateJsonFeed, generateAtomFeed, generateFeedItems } from '../../../src/lib/feed';
// Mock the posts module since feed.ts depends on getAllPostsAsync
vi.mock('../../../src/lib/posts', () => ({
	getAllPostsAsync: vi.fn()
}));

// Mock site URL
const mockOrigin = 'https://www.jacky.wtf';

describe('JSON Feed endpoint', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns valid JSON with content-type application/json', async () => {
		const { GET } = await import('../../../src/routes/feed/json/+server');
		const response = await GET();

		expect(response.headers.get('content-type')).toMatch(/application\/json/);
		expect(response.headers.get('content-type')).toMatch(/charset=utf-8/);

		const body = await response.json();
		expect(body).toBeDefined();
	});

	it('returns JSON Feed 1.0 compliant structure', async () => {
		const { GET } = await import('../../../src/routes/feed/json/+server');
		const response = await GET();
		const body = await response.json();

		// JSON Feed 1.0 required fields
		expect(body).toHaveProperty('version');
		expect(body.version).toBe('https://jsonfeed.org/version/1.1');

		expect(body).toHaveProperty('title');
		expect(typeof body.title).toBe('string');

		expect(body).toHaveProperty('items');
		expect(Array.isArray(body.items)).toBe(true);

		// Optional but common fields
		expect(body).toHaveProperty('home_page_url');
		expect(body).toHaveProperty('feed_url');
	});

	it('JSON feed items have required properties', async () => {
		const { GET } = await import('../../../src/routes/feed/json/+server');
		const response = await GET();
		const body = await response.json();

		if (body.items.length > 0) {
			const item = body.items[0];
			expect(item).toHaveProperty('id');
			expect(item).toHaveProperty('url');
			expect(item).toHaveProperty('title');
			expect(item).toHaveProperty('content_html');
			expect(item).toHaveProperty('date_published');
		}
	});

	it('returns JSON Feed with correct content-type header', async () => {
		const { GET } = await import('../../../src/routes/feed/json/+server');
		const response = await GET();

		const contentType = response.headers.get('content-type');
		expect(contentType).toContain('application/feed+json');
	});
});

describe('ATOM Feed endpoint', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns XML with content-type application/atom+xml', async () => {
		const { GET } = await import('../../../src/routes/feed/atom/+server');
		const response = await GET();

		expect(response.headers.get('content-type')).toMatch(/application\/atom\+xml/);
		expect(response.headers.get('content-type')).toMatch(/charset=utf-8/);
	});

	it('returns valid ATOM feed structure', async () => {
		const { GET } = await import('../../../src/routes/feed/atom/+server');
		const response = await GET();
		const body = await response.text();

		// ATOM feed should have feed element
		expect(body).toContain('<feed');
		expect(body).toContain('</feed>');

		// ATOM elements
		expect(body).toContain('<title');
		expect(body).toContain('<id>');
		expect(body).toContain('<updated>');
		expect(body).toContain('<link');

		// Entry elements
		expect(body).toContain('<entry>');
		expect(body).toContain('</entry>');
	});

	it('ATOM feed contains required elements', async () => {
		const { GET } = await import('../../../src/routes/feed/atom/+server');
		const response = await GET();
		const body = await response.text();

		// Check for essential ATOM elements
		expect(body).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
		expect(body).toContain('<title type="text">Olamaelcu Blog</title>');
		expect(body).toContain('<author>');
		expect(body).toContain('<name>Jacky</name>');

		// Should have self link for the ATOM feed itself
		expect(body).toContain('rel="self"');
		expect(body).toContain('type="application/atom+xml"');
	});

	it('ATOM feed entries contain required elements', async () => {
		const { GET } = await import('../../../src/routes/feed/atom/+server');
		const response = await GET();
		const body = await response.text();

		// If there are entries, they should have required elements
		if (body.includes('<entry>')) {
			expect(body).toContain('<title type="text">');
			expect(body).toContain('<id>');
			expect(body).toContain('<published>');
			expect(body).toContain('<updated>');
			expect(body).toContain('<content type="html">');
		}
	});
});

describe('feed.ts module', () => {
	it('generateJsonFeed returns valid JSON Feed 1.1', async () => {
		const feed = await generateJsonFeed(mockOrigin);
		const parsed = JSON.parse(feed);

		expect(parsed.version).toBe('https://jsonfeed.org/version/1.1');
		expect(parsed.title).toBe('Olamaelcu Blog');
		expect(parsed.feed_url).toBe(`${mockOrigin}/feed/json`);
	});

	it('generateAtomFeed returns valid XML', async () => {
		const feed = await generateAtomFeed(mockOrigin);

		expect(feed).toContain('<?xml version="1.0" encoding="utf-8"?>');
		expect(feed).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
	});

	it('generateFeedItems returns array of FeedItem', async () => {
		const items = await generateFeedItems(mockOrigin);

		expect(Array.isArray(items)).toBe(true);

		if (items.length > 0) {
			const item = items[0];
			expect(item).toHaveProperty('title');
			expect(item).toHaveProperty('description');
			expect(item).toHaveProperty('content');
			expect(item).toHaveProperty('url');
			expect(item).toHaveProperty('published');
			expect(item).toHaveProperty('author');
			expect(item.author).toHaveProperty('name');
		}
	});

	it('generateAtomFeed escapes XML special characters', async () => {
		const { getAllPostsAsync } = await import('../../../src/lib/posts');

		// Mock posts with special characters
		vi.mocked(getAllPostsAsync).mockResolvedValue([
			{
				title: 'Test <&> "quote"',
				description: 'Description with & special chars',
				content: 'Content with <html> and "quotes"',
				date: '2024-01-15',
				slug: 'test-post',
				year: '2024',
				tags: ['test', 'demo'],
				authors: [],
				toc: []
			}
		]);

		const feed = await generateAtomFeed(mockOrigin);

		// Should be escaped
		expect(feed).toContain('&lt;');
		expect(feed).toContain('&gt;');
		expect(feed).toContain('&amp;');
		expect(feed).toContain('&quot;');
	});
});
