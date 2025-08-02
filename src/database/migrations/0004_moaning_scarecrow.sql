PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`hours` integer NOT NULL,
	`minutes` integer NOT NULL,
	`students` integer NOT NULL,
	`comments` text,
	`date` text NOT NULL,
	`year` integer NOT NULL,
	`month` integer NOT NULL,
	`day` integer NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_reports`("id", "hours", "minutes", "students", "comments", "date", "year", "month", "day", "createdAt", "updatedAt") SELECT "id", "hours", "minutes", "students", "comments", "date", "year", "month", "day", "createdAt", "updatedAt" FROM `reports`;--> statement-breakpoint
DROP TABLE `reports`;--> statement-breakpoint
ALTER TABLE `__new_reports` RENAME TO `reports`;--> statement-breakpoint
PRAGMA foreign_keys=ON;