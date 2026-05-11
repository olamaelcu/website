import { env } from '$env/dynamic/private';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const waitlistItems = sqliteTable('waitlist_items', {
	id: text('id').primaryKey(),
	maxSeats: integer('max_seats'),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
	status: text('status').notNull().default('incubate')
});

export const waitlistEntries = sqliteTable(
	'waitlist_entries',
	{
		feature: text('feature').notNull(),
		email: text('email').notNull()
	},
	(table) => ({
		featureEmailUnique: uniqueIndex('waitlist_entries_feature_email_idx').on(
			table.feature,
			table.email
		)
	})
);

let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;
let _initPromise: Promise<ReturnType<typeof drizzle<typeof schema>>> | undefined;

const schema = { waitlistItems, waitlistEntries };

async function getClient(): Promise<ReturnType<typeof drizzle<typeof schema>>> {
	if (_db) return _db;
	if (!_initPromise) {
		_initPromise = (async () => {
			const url = env.WAITLIST_DATABASE_URL ?? 'file:./data.db';
			const authToken = env.WAITLIST_DATABASE_AUTH_TOKEN;
			const client = createClient({ url, authToken });
			const instance = drizzle(client, { schema });
			_db = instance;
			return instance;
		})();
	}
	return _initPromise;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
	get(_target, prop) {
		// Synchronous access — must already be initialized
		if (!_db) {
			throw new Error('Database not initialized. Call ensureDb() first.');
		}
		return _db[prop as keyof ReturnType<typeof drizzle<typeof schema>>];
	}
});

/** Ensure the database is initialized. Call in server load functions before using `db`. */
export async function ensureDb(): Promise<void> {
	await getClient();
}

/** Check if the database has been initialized. */
export function isDbReady(): boolean {
	return _db !== undefined;
}
