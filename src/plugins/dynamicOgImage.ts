import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Plugin } from 'vite';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import matter from 'gray-matter';

interface Author {
	did: string;
	name: string;
	url: string;
}

interface Post {
	slug: string;
	year: string;
	title: string;
	date: string;
	draft: boolean;
	description: string;
	tags: string[];
	authors: Author[];
	bskyPostUri?: string;
}

function readPostsDir(root: string): { path: string; raw: string }[] {
	const contentDir = join(root, 'content', 'posts');
	const results: { path: string; raw: string }[] = [];

	function walk(dir: string) {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const full = join(dir, entry.name);
			if (entry.isDirectory()) {
				walk(full);
			} else if (entry.isFile() && entry.name.endsWith('.md')) {
				const raw = readFileSync(full, 'utf-8');
				results.push({ path: full, raw });
			}
		}
	}

	walk(contentDir);
	return results;
}

function parsePost(filePath: string, raw: string): Post {
	const { data } = matter(raw);
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

	return {
		slug,
		year,
		title: String(data.title ?? slug),
		date: dateStr,
		description: String(data.description ?? ''),
		tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
		authors,
		bskyPostUri,
		draft: Boolean(data.draft)
	};
}

async function generateDefaultOgImage(
	root: string,
	pageTitle: string,
	pageDescription: string
): Promise<Buffer> {
	const fontPath = join(root, 'node_modules/@fontsource/kalnia/files/kalnia-latin-400-normal.woff');
	const fontData = readFileSync(fontPath);

	const logoPath = join(root, 'static', 'favicon.png');
	const logoData = readFileSync(logoPath);
	const logoBase64 = logoData.toString('base64');

	const year = new Date().getFullYear().toString();

	const svg = await satori(
		{
			type: 'div',
			key: null,
			props: {
				style: {
					width: '1200px',
					height: '630px',
					background: '#faf9f7',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '80px',
					fontFamily: 'Kalnia'
				},
				children: [
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								width: '100%'
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											gap: '12px'
										},
										children: [
											{
												type: 'img',
												props: {
													src: `data:image/png;base64,${logoBase64}`,
													style: { width: '40px', height: '40px' }
												}
											},
											{
												type: 'div',
												props: {
													style: {
														fontSize: '18px',
														color: '#78716c',
														letterSpacing: '0.05em',
														textTransform: 'uppercase'
													},
													children: 'Olamaelcu'
												}
											}
										]
									}
								},
								{
									type: 'div',
									props: {
										style: { fontSize: '14px', color: '#a8a29e' },
										children: year
									}
								}
							]
						}
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								flexDirection: 'column',
								gap: '24px',
								maxWidth: '900px'
							},
							children: [
								{
									type: 'h1',
									props: {
										style: {
											fontSize: '64px',
											fontWeight: 400,
											color: '#1c1917',
											lineHeight: 1.1,
											margin: 0
										},
										children: pageTitle
									}
								},
								pageDescription
									? {
											type: 'p',
											props: {
												style: {
													fontSize: '24px',
													color: '#78716c',
													lineHeight: 1.4,
													margin: 0
												},
												children: pageDescription
											}
										}
									: { type: 'span', props: { children: '' } }
							]
						}
					},
					{
						type: 'div',
						props: {
							style: {
								width: '100%',
								height: '2px',
								background: '#e7e5e4'
							}
						}
					}
				]
			}
		},
		{
			width: 1200,
			height: 630,
			fonts: [{ name: 'Kalnia', data: fontData, weight: 400, style: 'normal' }]
		}
	);

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
	return resvg.render().asPng();
}

async function generateOgImage(post: Post, root: string): Promise<Buffer> {
	const fontPath = join(root, 'node_modules/@fontsource/kalnia/files/kalnia-latin-400-normal.woff');
	const fontData = readFileSync(fontPath);

	const logoPath = join(root, 'static', 'favicon.png');
	const logoData = readFileSync(logoPath);
	const logoBase64 = logoData.toString('base64');

	const svg = await satori(
		{
			type: 'div',
			key: null,
			props: {
				style: {
					width: '1200px',
					height: '630px',
					background: '#faf9f7',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: '80px',
					fontFamily: 'Kalnia'
				},
				children: [
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								width: '100%'
							},
							children: [
								{
									type: 'div',
									props: {
										style: {
											display: 'flex',
											alignItems: 'center',
											gap: '12px'
										},
										children: [
											{
												type: 'img',
												props: {
													src: `data:image/png;base64,${logoBase64}`,
													style: {
														width: '40px',
														height: '40px'
													}
												}
											},
											{
												type: 'div',
												props: {
													style: {
														fontSize: '18px',
														color: '#78716c',
														letterSpacing: '0.05em',
														textTransform: 'uppercase'
													},
													children: 'Olamaelcu'
												}
											}
										]
									}
								},
								{
									type: 'div',
									props: {
										style: {
											fontSize: '14px',
											color: '#a8a29e'
										},
										children: post.date
									}
								}
							]
						}
					},
					{
						type: 'div',
						props: {
							style: {
								display: 'flex',
								flexDirection: 'column',
								gap: '24px',
								maxWidth: '900px'
							},
							children: [
								{
									type: 'h1',
									props: {
										style: {
											fontSize: '64px',
											fontWeight: 400,
											color: '#1c1917',
											lineHeight: 1.1,
											margin: 0
										},
										children: post.title
									}
								},
								post.description
									? {
											type: 'p',
											props: {
												style: {
													fontSize: '24px',
													color: '#78716c',
													lineHeight: 1.4,
													margin: 0
												},
												children: post.description
											}
										}
									: { type: 'span', props: { children: '' } }
							]
						}
					},
					{
						type: 'div',
						props: {
							style: {
								width: '100%',
								height: '2px',
								background: '#e7e5e4'
							}
						}
					}
				]
			}
		},
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: 'Kalnia',
					data: fontData,
					weight: 400,
					style: 'normal'
				}
			]
		}
	);

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
	return resvg.render().asPng();
}

export function ogImagePlugin(): Plugin {
	return {
		name: 'vite-plugin-og-images',
		async buildStart() {
			const pluginRoot = dirname(fileURLToPath(import.meta.url));
			const root = join(pluginRoot, '..', '..');
			const posts = readPostsDir(root)
				.map(({ path, raw }) => parsePost(path, raw))
				.filter((post) => !post.draft);
			const outDir = join(root, 'static', 'blog-og');
			mkdirSync(outDir, { recursive: true });
			for (const post of posts) {
				const png = await generateOgImage(post, root);
				writeFileSync(join(outDir, `${post.year}-${post.slug}.png`), png);
				console.log(`Generated OG image: ${post.year}-${post.slug}.png`);
			}
			const defaultOgImagePath = join(root, 'static', 'og-default.png');
			if (!existsSync(defaultOgImagePath)) {
				const defaultPng = await generateDefaultOgImage(
					root,
					'Olamaelcu',
					'A little software lab.'
				);
				writeFileSync(defaultOgImagePath, defaultPng);
				console.log('Generated default OG image: og-default.png');
			}
		}
	};
}
