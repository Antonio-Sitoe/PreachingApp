CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`hours` integer DEFAULT 0 NOT NULL,
	`minutes` integer DEFAULT 0 NOT NULL,
	`students` integer DEFAULT 0 NOT NULL,
	`comments` text,
	`date` text NOT NULL,
	`year` integer NOT NULL,
	`month` integer NOT NULL,
	`day` integer NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `reports_year_month_idx` ON `reports` (`year`,`month`);