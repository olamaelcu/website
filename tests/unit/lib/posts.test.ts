import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '../../../src/lib/posts';

describe('renderMarkdown - footnotes', () => {
	it('renders a Pandoc-style footnote marker as a superscript reference', () => {
		const md = 'Hello[^1].\n\n[^1]: A note about hello.';
		const html = renderMarkdown(md);

		expect(html).toMatch(/<sup>[\s\S]*?data-footnote-ref[\s\S]*?<\/sup>/);
		expect(html).toMatch(/href="#footnote-1"/);
		expect(html).toMatch(/id="footnote-ref-1"/);
	});

	it('emits a footnotes section with the definition', () => {
		const md = 'Hello[^1].\n\n[^1]: A note about hello.';
		const html = renderMarkdown(md);

		expect(html).toContain('<section class="footnotes"');
		expect(html).toContain('A note about hello.');
	});

	it('numbers multiple footnotes sequentially and includes a back-reference link', () => {
		const md = 'A[^x] and B[^y].\n\n[^x]: first\n\n[^y]: second';
		const html = renderMarkdown(md);

		expect(html).toMatch(/href="#footnote-x"/);
		expect(html).toMatch(/href="#footnote-y"/);
		expect(html).toContain('>1</a>');
		expect(html).toContain('>2</a>');
		expect(html).toContain('first');
		expect(html).toContain('second');
		expect(html).toContain('data-footnote-backref');
	});

	it('preserves reference-style links alongside footnotes', () => {
		const md = 'See [the docs][1] and also[^a].\n\n[1]: https://example.com\n\n[^a]: a note';
		const html = renderMarkdown(md);

		expect(html).toContain('href="https://example.com');
		expect(html).toMatch(/data-footnote-ref/);
	});

	it('does not crash on markdown with no footnotes', () => {
		const md = 'Just a paragraph with a [link](https://example.com).';
		const html = renderMarkdown(md);

		expect(html).toContain('<p>');
		expect(html).toContain('href="https://example.com');
		expect(html).not.toContain('class="footnotes"');
	});
});
