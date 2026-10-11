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
