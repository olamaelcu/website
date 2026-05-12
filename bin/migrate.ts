import { createClient } from '@libsql/client';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, basename } from 'node:path';

const token = process.env.DATABASE_AUTH_TOKEN;
const url = process.env.DATABASE_URL ?? 'libsql://landing-jalcine.aws-us-east-2.turso.io';

if (!token) {
	console.error('DATABASE_AUTH_TOKEN is required');
	process.exit(1);
}

function validateMigrationFile(filename: string): string {
	const safeFilenameRegex = /^[a-zA-Z0-9_-]+\.sql$/;
	if (!safeFilenameRegex.test(filename)) {
		throw new Error(`Invalid migration filename: ${filename}`);
	}

	if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
		throw new Error(`Migration filename contains invalid characters: ${filename}`);
	}

	const safeName = basename(filename);
	if (safeName !== filename) {
		throw new Error(`Migration filename must not contain path components: ${filename}`);
	}

	return safeName;
}

const migrationFile =
	process.env.MIGRATION_FILE ??
	(() => {
		const drizzleDir = resolve(process.cwd(), 'drizzle');

		try {
			const stats = statSync(drizzleDir);
			if (!stats.isDirectory()) {
				throw new Error(`drizzle path is not a directory: ${drizzleDir}`);
			}
		} catch (err) {
			if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'ENOENT') {
				throw new Error(`drizzle directory does not exist: ${drizzleDir}`);
			}
			throw err;
		}

		const files = readdirSync(drizzleDir)
			.filter((f) => f.endsWith('.sql'))
			.sort();

		if (files.length === 0) {
			throw new Error('No migration files found in drizzle directory');
		}

		return files[files.length - 1];
	})();

const safeMigrationFile = validateMigrationFile(migrationFile);

const client = createClient({ url, authToken: token });

const migrationPath = resolve(process.cwd(), 'drizzle', safeMigrationFile);

const expectedDrizzleDir = resolve(process.cwd(), 'drizzle');
if (!migrationPath.startsWith(expectedDrizzleDir)) {
	throw new Error(`Migration path escapes drizzle directory: ${migrationPath}`);
}

const sql = readFileSync(migrationPath, 'utf-8');

const stmts = sql
	.split(';')
	.map((s) => s.replace(/--> statement-breakpoint/g, '').trim())
	.filter((s) => s && !s.startsWith('-->') && !s.startsWith('PRAGMA'));

let count = 0;
for (const stmt of stmts) {
	try {
		await client.execute(stmt);
		count++;
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : String(e);
		if (msg.includes('already exists') || msg.includes('duplicate column name')) {
			console.warn(`Skipping: ${stmt.substring(0, 60)}...`);
			continue;
		}
		console.error(`Error executing: ${stmt.substring(0, 60)}...`);
		throw e;
	}
}

console.log(`Ran ${count} statements from ${migrationFile} against ${url}`);
client.close();
