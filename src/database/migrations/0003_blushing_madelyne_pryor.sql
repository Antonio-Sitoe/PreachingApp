CREATE TABLE `appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`visit_id` text,
	`scheduled_at` text NOT NULL,
	`time_of_day` text DEFAULT 'any' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`remind_minutes_before` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `appointments_status_scheduled_at_idx` ON `appointments` (`status`,`scheduled_at`);