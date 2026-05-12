import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const roadmapEntries = sqliteTable('roadmap_entries', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectKey: text('project_key').notNull(),
	entryDate: text('entry_date').notNull(),
	category: text('category').notNull(),
	description: text('description').notNull(),
	linkUrl: text('link_url'),
	linkLabel: text('link_label'),
	createdAt: text('created_at').default("datetime('now')")
});
