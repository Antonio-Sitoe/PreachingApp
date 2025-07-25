CREATE TABLE `student_availabilities` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`week_day` text NOT NULL,
	`start_time` text,
	`end_time` text,
	`notification_enabled` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `visits` DROP COLUMN `next_time`;--> statement-breakpoint
ALTER TABLE `visits` DROP COLUMN `videos`;--> statement-breakpoint
ALTER TABLE `students` DROP COLUMN `best_time`;--> statement-breakpoint
ALTER TABLE `students` DROP COLUMN `best_day`;