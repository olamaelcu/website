import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const waitlistItems = sqliteTable('waitlist_items', {
	id: text('id').primaryKey(),
	maxSeats: integer('max_seats'),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true)
});

export const waitlistEntries = sqliteTable('waitlist_entries', {
	feature: text('feature').notNull()
});

let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

const schema = { waitlistItems, waitlistEntries };

const getClient = () => {
	if (!_db) {
		const url = process.env.WAITLIST_DATABASE_URL ?? 'file:./data.db';
		const authToken = process.env.WAITLIST_DATABASE_AUTH_TOKEN;
		const client = createClient({ url, authToken });
		_db = drizzle(client, { schema });
	}
	return _db;
};

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
	get(_target, prop) {
		return getClient()[prop as keyof ReturnType<typeof drizzle<typeof schema>>];
	}
});
