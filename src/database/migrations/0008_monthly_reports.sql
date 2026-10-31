CREATE TABLE `monthly_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`year` integer NOT NULL,
	`month` integer NOT NULL,
	`publisher_type` text,
	`participated` integer,
	`bible_studies` integer,
	`hours` integer,
	`sent_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `monthly_reports_year_month_idx` ON `monthly_reports` (`year`,`month`);