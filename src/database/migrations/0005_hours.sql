CREATE TABLE `time_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`started_at` text NOT NULL,
	`minutes` integer NOT NULL,
	`source` text DEFAULT 'manual' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `time_entries_started_at_idx` ON `time_entries` (`started_at`);--> statement-breakpoint
CREATE TABLE `month_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`month` integer NOT NULL,
	`publisher_type` text NOT NULL,
	`hour_goal` integer NOT NULL,
	`weekdays` text DEFAULT '' NOT NULL,
	`minutes_per_day` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `month_plans_year_month_idx` ON `month_plans` (`year`,`month`);--> statement-breakpoint
CREATE TABLE `plan_days` (
	`id` text PRIMARY KEY NOT NULL,
	`month_plan_id` text NOT NULL,
	`day` text NOT NULL,
	`planned_minutes` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`month_plan_id`) REFERENCES `month_plans`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `plan_days_plan_day_idx` ON `plan_days` (`month_plan_id`,`day`);--> statement-breakpoint
INSERT INTO `time_entries` (`id`, `started_at`, `minutes`, `source`, `created_at`, `updated_at`, `deleted_at`, `sync_status`)
SELECT
	lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))), 2) || '-' || substr('89ab', 1 + (abs(random()) % 4), 1) || substr(lower(hex(randomblob(2))), 2) || '-' || lower(hex(randomblob(6))),
	`date` || 'T12:00:00.000Z',
	`hours` * 60 + `minutes`,
	'manual',
	`created_at`,
	`updated_at`,
	NULL,
	'pending'
FROM `reports`
WHERE `deleted_at` IS NULL AND `hours` * 60 + `minutes` > 0;
