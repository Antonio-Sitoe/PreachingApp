CREATE TABLE `lesson_progress` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`lesson_number` integer NOT NULL,
	`started_at` text NOT NULL,
	`completed_at` text,
	`goal_done` integer DEFAULT false NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `lesson_progress_student_id_idx` ON `lesson_progress` (`student_id`,`lesson_number`);--> statement-breakpoint
ALTER TABLE `visits` ADD `question_resolved_at` text;--> statement-breakpoint
ALTER TABLE `milestones` ADD `note` text;--> statement-breakpoint
INSERT INTO `lesson_progress`("id", "student_id", "lesson_number", "started_at", "completed_at", "goal_done", "created_at", "updated_at", "sync_status") SELECT lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-' || substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))), v."student_id", v."lesson_number", MIN(v."visited_at"), (SELECT MIN(n."visited_at") FROM `visits` n WHERE n."student_id" = v."student_id" AND n."lesson_number" > v."lesson_number" AND n."outcome" = 'met' AND n."deleted_at" IS NULL), 0, MIN(v."visited_at"), MIN(v."visited_at"), 'pending' FROM `visits` v WHERE v."lesson_number" IS NOT NULL AND v."outcome" = 'met' AND v."deleted_at" IS NULL GROUP BY v."student_id", v."lesson_number";