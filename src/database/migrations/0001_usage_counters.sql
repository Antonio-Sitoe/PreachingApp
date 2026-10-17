CREATE TABLE `usage_counters` (
	`id` text PRIMARY KEY NOT NULL,
	`day` text NOT NULL,
	`event` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`sent_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usage_counters_day_event_idx` ON `usage_counters` (`day`,`event`);