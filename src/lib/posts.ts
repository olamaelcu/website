import matter from 'gray-matter';
import { marked } from 'marked';
import createDOMPurify from 'isomorphic-dompurify';

// Function to add UTM parameters to external links in HTML
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

export interface PostMeta {
	slug: string;
	year: string;
	title: string;
	date: string;
	draft?: boolean;
	description: string;
	tags: string[];
}

export interface Post extends PostMeta {
	content: string;
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

	return {
		slug,
		year,
		title: String(data.title ?? slug),
		date: dateStr,
		description: String(data.description ?? ''),
		tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
		content: addUtmToLinks(createDOMPurify.sanitize(marked(content) as string), slug),
		draft
	};
}

export async function getAllPostsAsync(): Promise<Post[]> {
	const files = import.meta.glob('/content/posts/**/*.md', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>;
	return Object.entries(files)
		.map(([path, raw]) => parsePost(path, raw))
		.filter((post) => post.draft === import.meta.env.DEV)
		.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostAsync(year: string, slug: string): Promise<Post | undefined> {
	const posts = await getAllPostsAsync();
	return posts.find((p) => p.year === year && p.slug === slug);
}
