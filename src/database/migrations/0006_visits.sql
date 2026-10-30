CREATE TABLE `visits` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`visited_at` text NOT NULL,
	`outcome` text DEFAULT 'met' NOT NULL,
	`notes` text,
	`scriptures` text,
	`pending_question` text,
	`promised_to_bring` text,
	`lesson_number` integer,
	`stopped_at_point` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `visits_student_id_visited_at_idx` ON `visits` (`student_id`,`visited_at`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`visit_id` text,
	`scheduled_at` text NOT NULL,
	`time_of_day` text DEFAULT 'any' NOT NULL,
	`time` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`remind_minutes_before` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`visit_id`) REFERENCES `visits`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_appointments`("id", "student_id", "visit_id", "scheduled_at", "time_of_day", "time", "status", "remind_minutes_before", "created_at", "updated_at", "deleted_at", "sync_status") SELECT "id", "student_id", "visit_id", "scheduled_at", "time_of_day", NULL, "status", "remind_minutes_before", "created_at", "updated_at", "deleted_at", "sync_status" FROM `appointments`;--> statement-breakpoint
DROP TABLE `appointments`;--> statement-breakpoint
ALTER TABLE `__new_appointments` RENAME TO `appointments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `appointments_status_scheduled_at_idx` ON `appointments` (`status`,`scheduled_at`);