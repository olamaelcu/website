import { createClient } from '@libsql/client';

const migrations = [
	`CREATE TABLE IF NOT EXISTS roadmap_entries (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		project_key TEXT NOT NULL,
		entry_date TEXT NOT NULL,
		category TEXT NOT NULL,
		description TEXT NOT NULL,
		link_url TEXT,
		link_label TEXT,
		created_at TEXT DEFAULT (datetime('now'))
	)`,
	`CREATE INDEX IF NOT EXISTS idx_project_key ON roadmap_entries(project_key)`,
	`CREATE INDEX IF NOT EXISTS idx_entry_date ON roadmap_entries(entry_date)`
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
