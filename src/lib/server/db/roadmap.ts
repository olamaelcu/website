import { eq, asc } from 'drizzle-orm';
import { db } from './index';
import { roadmapEntries } from './schema';

export async function getRoadmapEntries(projectKey: string) {
	const results = await db
		.select()
		.from(roadmapEntries)
		.where(eq(roadmapEntries.projectKey, projectKey))
		.orderBy(asc(roadmapEntries.entryDate));

	return results.map((row) => ({
		entry_date: row.entryDate,
		category: row.category,
		description: row.description,
		link_url: row.linkUrl ?? undefined,
		link_label: row.linkLabel ?? undefined
	}));
}
