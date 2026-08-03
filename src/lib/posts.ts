import matter from 'gray-matter';
import { Marked } from 'marked';
import markedFootnote from 'marked-footnote';
import createDOMPurify from 'isomorphic-dompurify';

const md = new Marked().use(markedFootnote());

export function renderMarkdown(markdown: string): string {
	return createDOMPurify.sanitize(md.parse(markdown) as string);
}

export interface Author {
	did: string;
	name: string;
	url: string;
}

export interface TocItem {
	level: 2 | 3;
	text: string;
	id: string;
}

export interface PostMeta {
	slug: string;
	year: string;
	title: string;
	date: string;
	draft?: boolean;
	description: string;
	tags: string[];
	authors: Author[];
	bskyPostUri?: string;
	audience?: string;
}

export interface Post extends PostMeta {
	content: string;
	toc: TocItem[];
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.trim();
}

function extractToc(html: string): { content: string; toc: TocItem[] } {
	const toc: TocItem[] = [];
	let headingIndex = 0;

	const content = html.replace(/<h([23])[^>]*>([\s\S]*?)<\/h[23]>/gi, (match, level, inner) => {
		const text = inner.replace(/<[^>]+>/g, '').trim();
		const id = slugify(text) + '-' + headingIndex++;
		toc.push({ level: Number(level) as 2 | 3, text, id });
		return match.replace(/<h([23])([^>]*)>/, `<h$1$2 id="${id}">`);
	});

	return { content, toc };
}

function addUtmToLinks(html: string, slug: string): string {
	const utmParams = `utm_source=olamaelcu.net&utm_medium=blog&utm_campaign=${slug}_post`;

	return html.replace(/href=(["'])(https?:\/\/[^"']+)\1/gi, (match, quote, url) => {
		if (url.includes('utm_')) {
			return match;
		}
		const separator = url.includes('?') ? '&' : '?';
		return `href=${quote}${url}${separator}${utmParams}${quote}`;
	});
}

function parsePost(filePath: string, raw: string): Post {
	const { data, content } = matter(raw);
	const slug = filePath.replace(/.*\/(.*)\.md$/, '$1');
	const rawDate = data.date;
	const draft = data.draft ?? false;
	let dateStr: string;
	if (rawDate instanceof Date) {
		dateStr = rawDate.toISOString().slice(0, 10);
	} else if (rawDate) {
		const d = new Date(String(rawDate));
		dateStr = isNaN(d.getTime()) ? String(rawDate) : d.toISOString().slice(0, 10);
	} else {
		dateStr = '';
	}
	const year = dateStr.slice(0, 4);

	// Parse authors from frontmatter
	const authors: Author[] = Array.isArray(data.authors)
		? data.authors.map((a: { did?: string; name?: string; url?: string }) => ({
				did: String(a.did ?? ''),
				name: String(a.name ?? ''),
				url: String(a.url ?? '')
			}))
		: [];

	// Parse bskyPostUri from frontmatter
	const bskyPostUri = data.bskyPostUri ? String(data.bskyPostUri) : undefined;

	// Parse audience from frontmatter
	const audience = data.audience ? String(data.audience) : undefined;

	// Parse and sanitize content, extract TOC, add UTM params
	const rawHtml = renderMarkdown(content);

	// marked-footnote emits <section class="footnotes">…</section> at the end.
	// Strip it before TOC extraction so the "Footnotes" heading doesn't leak
	// into the article's table of contents, then re-append it.
	const FOOTNOTE_SECTION = /<section class="footnotes"[\s\S]*?<\/section>/;
	const footnoteMatch = rawHtml.match(FOOTNOTE_SECTION);
	const footnoteSection = footnoteMatch ? footnoteMatch[0] : '';
	const articleBody = footnoteSection ? rawHtml.replace(FOOTNOTE_SECTION, '') : rawHtml;

	const { content: tocContent, toc } = extractToc(articleBody);
	const processedContent = addUtmToLinks(tocContent, slug) + footnoteSection;

	return {
		slug,
		year,
		title: String(data.title ?? slug),
		date: dateStr,
		description: String(data.description ?? ''),
		tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
		authors,
		bskyPostUri,
		audience,
		content: processedContent,
		toc,
		draft
	};
}

function includeDraftsOnDev(post: { draft?: boolean }): boolean {
	if (import.meta.env.DEV === true) {
		return true;
	} else {
		return post.draft !== true;
	}
}

export async function getAllPostsAsync(): Promise<Post[]> {
	const files = import.meta.glob('/content/posts/**/*.md', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>;
	return Object.entries(files)
		.map(([path, raw]) => parsePost(path, raw))
		.filter(includeDraftsOnDev)
		.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostAsync(year: string, slug: string): Promise<Post | undefined> {
	const posts = await getAllPostsAsync();
	return posts.find((p) => p.year === year && p.slug === slug);
}
