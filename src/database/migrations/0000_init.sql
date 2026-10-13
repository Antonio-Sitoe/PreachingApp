CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`publisher_type` text DEFAULT 'publisher' NOT NULL,
	`language` text DEFAULT 'pt' NOT NULL,
	`monthly_hour_goal` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`display_name` text NOT NULL,
	`name_is_provisional` integer DEFAULT false NOT NULL,
	`phone` text,
	`stage` text DEFAULT 'contact' NOT NULL,
	`status` text,
	`rhythm_days` integer,
	`latitude` real,
	`longitude` real,
	`address` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`sync_status` text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`search_text` text DEFAULT '' NOT NULL,
	`tag_id` text,
	`color` text DEFAULT '#E3E7F8' NOT NULL,
	`student_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`remote_id` text,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
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
--> statement-breakpoint
INSERT OR IGNORE INTO `tags` (`id`, `name`, `created_at`, `updated_at`, `sync_status`) VALUES
	('7c0f9d2a-1b3e-4c5d-8e6f-000000000001', 'Pregação', '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z', 'pending'),
	('7c0f9d2a-1b3e-4c5d-8e6f-000000000002', 'Reflexão', '2026-01-01T00:00:01.000Z', '2026-01-01T00:00:01.000Z', 'pending');