import matter from 'gray-matter';
import { marked } from 'marked';

export interface PostMeta {
	slug: string;
	year: string;
	title: string;
	date: string;
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
		content: marked(content) as string
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
		.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostAsync(year: string, slug: string): Promise<Post | undefined> {
	const posts = await getAllPostsAsync();
	return posts.find((p) => p.year === year && p.slug === slug);
}
