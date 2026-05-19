import { createClient } from '@libsql/client';

interface StackEntry {
	category: string;
	name: string;
	url: string;
	domain: string;
	description: string;
	sortOrder: number;
}

const stackEntries: StackEntry[] = [
	// Languages
	{
		category: 'Languages',
		name: 'Rust',
		url: 'https://www.rust-lang.org',
		domain: 'rust-lang.org',
		description: 'A language empowering everyone to build reliable and efficient software.',
		sortOrder: 1
	},
	{
		category: 'Languages',
		name: 'TypeScript',
		url: 'https://www.typescriptlang.org',
		domain: 'typescriptlang.org',
		description: 'JavaScript with syntax for types.',
		sortOrder: 2
	},
	{
		category: 'Languages',
		name: 'SvelteKit',
		url: 'https://kit.svelte.dev',
		domain: 'kit.svelte.dev',
		description: 'The official framework for building Svelte apps of any size.',
		sortOrder: 3
	},
	{
		category: 'Languages',
		name: 'Poem',
		url: 'https://github.com/poem-web/poem',
		domain: 'github.com',
		description: 'A full-featured and easy-to-use Rust web framework.',
		sortOrder: 4
	},
	{
		category: 'Languages',
		name: 'Bevy',
		url: 'https://bevyengine.org',
		domain: 'bevyengine.org',
		description: 'A refreshingly simple data-driven game engine built in Rust.',
		sortOrder: 5
	},
	{
		category: 'Languages',
		name: 'Godot 4',
		url: 'https://godotengine.org',
		domain: 'godotengine.org',
		description: 'A feature-packed, cross-platform game engine to create 2D and 3D games.',
		sortOrder: 6
	},
	{
		category: 'Languages',
		name: 'Tauri 2',
		url: 'https://tauri.app',
		domain: 'tauri.app',
		description: 'Build smaller, faster, and more secure desktop applications.',
		sortOrder: 7
	},

	// AT Protocol
	{
		category: 'AT Protocol',
		name: '@atproto/api',
		url: 'https://atproto.com',
		domain: 'atproto.com',
		description: 'Client library for the AT Protocol.',
		sortOrder: 1
	},
	{
		category: 'AT Protocol',
		name: '@atproto/oauth-client-node',
		url: 'https://atproto.com',
		domain: 'atproto.com',
		description: 'OAuth client for AT Protocol in Node.js.',
		sortOrder: 2
	},
	{
		category: 'AT Protocol',
		name: 'atrium-api',
		url: 'https://github.com/atrium-rs/atrium',
		domain: 'github.com',
		description: 'A Rust crate for interacting with the AT Protocol.',
		sortOrder: 3
	},
	{
		category: 'AT Protocol',
		name: 'atproto-identity',
		url: 'https://tangled.org',
		domain: 'tangled.org',
		description: 'Identity handling for AT Protocol.',
		sortOrder: 4
	},
	{
		category: 'AT Protocol',
		name: 'tapped',
		url: 'https://tangled.org',
		domain: 'tangled.org',
		description: 'A Rust crate for AT Protocol feed generation.',
		sortOrder: 5
	},

	// Frontend
	{
		category: 'Frontend',
		name: 'WebAwesome',
		url: 'https://webawesome.com',
		domain: 'webawesome.com',
		description: 'Open-source web components powered by Lit and Shoelace.',
		sortOrder: 1
	},
	{
		category: 'Frontend',
		name: 'TanStack Query',
		url: 'https://tanstack.com',
		domain: 'tanstack.com',
		description: 'Powerful asynchronous state management.',
		sortOrder: 2
	},
	{
		category: 'Frontend',
		name: 'Lucide',
		url: 'https://lucide.dev',
		domain: 'lucide.dev',
		description: 'Beautiful & consistent open-source icons.',
		sortOrder: 3
	},

	// Database
	{
		category: 'Database',
		name: 'SQLite',
		url: 'https://www.sqlite.org',
		domain: 'sqlite.org',
		description: 'A small, fast, self-contained SQL database engine.',
		sortOrder: 1
	},
	{
		category: 'Database',
		name: 'sqlx',
		url: 'https://github.com/launchbadge/sqlx',
		domain: 'github.com',
		description: 'An async, pure Rust SQL crate featuring compile-time checked queries.',
		sortOrder: 2
	},
	{
		category: 'Database',
		name: 'Drizzle ORM',
		url: 'https://orm.drizzle.team',
		domain: 'orm.drizzle.team',
		description: 'TypeScript ORM for SQL databases.',
		sortOrder: 3
	},
	{
		category: 'Database',
		name: 'libSQL',
		url: 'https://turso.tech',
		domain: 'turso.tech',
		description: 'SQLite fork that runs anywhere.',
		sortOrder: 4
	},
	{
		category: 'Database',
		name: 'SeaORM',
		url: 'https://www.sea-ql.org',
		domain: 'sea-ql.org',
		description: 'A relational ORM in Rust.',
		sortOrder: 5
	},

	// Infrastructure
	{
		category: 'Infrastructure',
		name: 'Pulumi',
		url: 'https://www.pulumi.com',
		domain: 'pulumi.com',
		description: 'Infrastructure as Code in any programming language.',
		sortOrder: 1
	},
	{
		category: 'Infrastructure',
		name: 'Sentry',
		url: 'https://sentry.io',
		domain: 'sentry.io',
		description: 'Application monitoring platform.',
		sortOrder: 2
	},
	{
		category: 'Infrastructure',
		name: 'Plausible',
		url: 'https://plausible.io',
		domain: 'plausible.io',
		description: 'Simple and privacy-friendly analytics.',
		sortOrder: 3
	},
	{
		category: 'Infrastructure',
		name: 'OpenTelemetry',
		url: 'https://opentelemetry.io',
		domain: 'opentelemetry.io',
		description: 'Open-source observability framework.',
		sortOrder: 4
	},

	// Testing
	{
		category: 'Testing',
		name: 'Vitest',
		url: 'https://vitest.dev',
		domain: 'vitest.dev',
		description: 'Blazing fast unit test framework powered by Vite.',
		sortOrder: 1
	},
	{
		category: 'Testing',
		name: 'Playwright',
		url: 'https://playwright.dev',
		domain: 'playwright.dev',
		description: 'Reliable end-to-end testing for modern web apps.',
		sortOrder: 2
	},
	{
		category: 'Testing',
		name: 'Testing Library',
		url: 'https://testing-library.com',
		domain: 'testing-library.com',
		description: 'Simple and complete testing utilities.',
		sortOrder: 3
	}
];

async function seedStack() {
	const url = process.env.DATABASE_URL;
	const authToken = process.env.DATABASE_AUTH_TOKEN;

	if (!url || !authToken) {
		console.error('DATABASE_URL and DATABASE_AUTH_TOKEN must be set');
		process.exit(1);
	}

	console.log(`Connecting to database: ${url}`);
	const client = createClient({ url, authToken });

	// Clear existing entries
	console.log('Clearing existing stack entries...');
	await client.execute('DELETE FROM stack_entries');

	// Insert new entries
	console.log(`Inserting ${stackEntries.length} stack entries...`);
	for (const entry of stackEntries) {
		await client.execute(
			`INSERT INTO stack_entries (category, name, url, domain, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
			[entry.category, entry.name, entry.url, entry.domain, entry.description, entry.sortOrder]
		);
		console.log(`  ✓ ${entry.category}: ${entry.name}`);
	}

	console.log('Seeding completed successfully.');
	client.close();
}

seedStack();
