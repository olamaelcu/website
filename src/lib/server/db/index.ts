import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

const getClient = () => {
	if (_db) return _db;
	const url = env.DATABASE_URL ?? 'file:./roadmap.db';
	const authToken = env.DATABASE_AUTH_TOKEN;
	const client = createClient({ url, authToken });
	_db = drizzle(client, { schema });
	return _db;
};

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
	get(_target, prop) {
		return getClient()[prop as keyof ReturnType<typeof drizzle<typeof schema>>];
	}
});
