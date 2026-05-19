import { createClient } from '@libsql/client';

const migrations = [
	`CREATE TABLE IF NOT EXISTS stack_entries (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		category TEXT NOT NULL,
		name TEXT NOT NULL,
		url TEXT NOT NULL,
		domain TEXT NOT NULL,
		description TEXT NOT NULL,
		sort_order INTEGER NOT NULL DEFAULT 0,
		created_at TEXT DEFAULT (datetime('now'))
	)`,
	`CREATE INDEX IF NOT EXISTS idx_stack_category ON stack_entries(category)`,
	`CREATE INDEX IF NOT EXISTS idx_stack_sort_order ON stack_entries(sort_order)`
];

async function runMigrations() {
	const url = process.env.DATABASE_URL;
	const authToken = process.env.DATABASE_AUTH_TOKEN;

	if (!url || !authToken) {
		console.error('DATABASE_URL and DATABASE_AUTH_TOKEN must be set');
		process.exit(1);
	}

	console.log(`Connecting to database: ${url}`);
	const client = createClient({ url, authToken });

	for (let i = 0; i < migrations.length; i++) {
		const sql = migrations[i];
		console.log(`Running migration ${i + 1}/${migrations.length}...`);
		try {
			await client.execute(sql);
			console.log(`  ✓ Migration ${i + 1} succeeded`);
		} catch (error) {
			console.error(`  ✗ Migration ${i + 1} failed:`, error);
			process.exit(1);
		}
	}

	console.log('All migrations completed successfully.');
	client.close();
}

runMigrations();
