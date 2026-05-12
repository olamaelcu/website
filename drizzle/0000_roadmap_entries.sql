CREATE TABLE `roadmap_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_key` text NOT NULL,
	`entry_date` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`link_url` text,
	`link_label` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `roadmap_entries_project_key_idx` ON `roadmap_entries` (`project_key`);
--> statement-breakpoint
CREATE INDEX `roadmap_entries_entry_date_idx` ON `roadmap_entries` (`entry_date`);