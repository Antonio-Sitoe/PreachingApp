CREATE TABLE `lesson_advances` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`visit_id` text NOT NULL,
	`lesson` integer NOT NULL,
	`previous_visit_lesson` integer,
	`undo_data` text NOT NULL,
	`undone_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`visit_id`) REFERENCES `visits`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `lesson_advances_student_id_idx` ON `lesson_advances` (`student_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `lesson_advances_visit_id_idx` ON `lesson_advances` (`visit_id`);