PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_students` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`display_name` text NOT NULL,
	`note` text,
	`phone` text,
	`stage` text DEFAULT 'first_contact' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`rhythm_days` integer DEFAULT 7 NOT NULL,
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
INSERT INTO `__new_students`("id", "user_id", "display_name", "note", "phone", "stage", "status", "rhythm_days", "latitude", "longitude", "address", "created_at", "updated_at", "deleted_at", "sync_status") SELECT "id", "user_id", "display_name", NULL, "phone", CASE "stage" WHEN 'contact' THEN 'first_contact' WHEN 'revisit' THEN 'return_visit' WHEN 'started' THEN 'study_started' WHEN 'regular' THEN 'regular_study' WHEN 'publisher' THEN 'unbaptized_publisher' WHEN 'baptized' THEN 'baptized' ELSE 'first_contact' END, CASE WHEN "stage" = 'paused' OR "status" = 'paused' THEN 'paused' WHEN "status" = 'closed' THEN 'closed' ELSE 'active' END, COALESCE("rhythm_days", 7), "latitude", "longitude", "address", "created_at", "updated_at", "deleted_at", "sync_status" FROM `students`;--> statement-breakpoint
DROP TABLE `students`;--> statement-breakpoint
ALTER TABLE `__new_students` RENAME TO `students`;--> statement-breakpoint
PRAGMA foreign_keys=ON;