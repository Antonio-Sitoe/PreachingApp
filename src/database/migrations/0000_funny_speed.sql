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
CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`search_text` text DEFAULT '' NOT NULL,
	`tag` text,
	`color` text DEFAULT '#E3E7F8' NOT NULL,
	`student_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	`remote_id` text,
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