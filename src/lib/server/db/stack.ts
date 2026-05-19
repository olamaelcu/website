import { asc } from 'drizzle-orm';
import { db } from './index';
import { stackEntries } from './schema';

export async function getStackEntries() {
	return db
		.select()
		.from(stackEntries)
		.orderBy(asc(stackEntries.category), asc(stackEntries.sortOrder));
}
