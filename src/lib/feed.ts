import { getAllPostsAsync } from './posts';

export interface FeedItem {
	title: string;
	description: string;
	content: string;
	url: string;
	published: string;
	updated: string;
	author: {
		name: string;
		uri?: string;
	};
	tags: string[];
}

export async function generateFeedItems(origin: string): Promise<FeedItem[]> {
	const posts = await getAllPostsAsync();

	return posts.map((post) => ({
		title: post.title,
		description: post.description,
		content: post.content,
		url: `${origin}/blog/${post.year}/${post.slug}`,
		published: new Date(post.date).toISOString(),
		updated: new Date(post.date).toISOString(),
		author: {
			name: 'Jacky',
			uri: 'https://www.jacky.wtf'
		},
		tags: post.tags
	}));
}

export async function generateAtomFeed(origin: string): Promise<string> {
	const items = await generateFeedItems(origin);
	const updated = items[0]?.updated || new Date().toISOString();

	return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title type="text">Olamaelcu Blog</title>
  <id>${escapeXml(`${origin}/blog`)}</id>
  <updated>${updated}</updated>
  <link rel="alternate" type="text/html" href="${escapeXml(`${origin}/blog`)}"/>
  <link rel="self" type="application/atom+xml" href="${escapeXml(`${origin}/feed/atom`)}"/>
  <author>
    <name>Jacky</name>
    <uri>https://www.jacky.wtf</uri>
  </author>
  ${items
		.map(
			(item) => `
  <entry>
    <title type="text">${escapeXml(item.title)}</title>
    <id>${escapeXml(item.url)}</id>
    <published>${item.published}</published>
    <updated>${item.updated}</updated>
    <link rel="alternate" type="text/html" href="${escapeXml(item.url)}"/>
    <content type="html">${escapeXml(item.content)}</content>
    <summary type="text">${escapeXml(item.description)}</summary>
    <author>
      <name>${escapeXml(item.author.name)}</name>
      ${item.author.uri ? `<uri>${escapeXml(item.author.uri)}</uri>` : ''}
    </author>
    ${item.tags.map((tag) => `<category term="${escapeXml(tag)}"/>`).join('')}
  </entry>`
		)
		.join('')}
</feed>`;
}

export async function generateJsonFeed(origin: string): Promise<string> {
	const items = await generateFeedItems(origin);

	return JSON.stringify(
		{
			version: 'https://jsonfeed.org/version/1.1',
			title: 'Olamaelcu Blog',
			home_page_url: `${origin}/blog`,
			feed_url: `${origin}/feed/json`,
			description: 'Thoughts, tutorials, and updates from Olamaelcu.',
			author: {
				name: 'Jacky',
				url: 'https://www.jacky.wtf'
			},
			items: items.map((item) => ({
				id: item.url,
				url: item.url,
				title: item.title,
				content_html: item.content,
				summary: item.description,
				date_published: item.published,
				date_modified: item.updated,
				authors: [item.author],
				tags: item.tags
			}))
		},
		null,
		2
	);
}

function escapeXml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
