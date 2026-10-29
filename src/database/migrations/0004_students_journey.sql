CREATE TABLE `stage_changes` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`from_stage` text,
	`to_stage` text NOT NULL,
	`changed_at` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `stage_changes_student_id_idx` ON `stage_changes` (`student_id`,`changed_at`);--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`type` text DEFAULT 'custom' NOT NULL,
	`label` text NOT NULL,
	`occurred_at` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `milestones_student_id_idx` ON `milestones` (`student_id`,`occurred_at`);--> statement-breakpoint
CREATE TABLE `pauses` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`reason` text DEFAULT 'other' NOT NULL,
	`note` text,
	`paused_at` text NOT NULL,
	`retry_at` text,
	`resumed_at` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pauses_student_id_idx` ON `pauses` (`student_id`,`paused_at`);--> statement-breakpoint
CREATE TABLE `student_availabilities` (
	`id` text PRIMARY KEY NOT NULL,
	`student_id` text NOT NULL,
	`weekday` integer NOT NULL,
	`time` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`deleted_at` text,
	`sync_status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `student_availabilities_student_id_idx` ON `student_availabilities` (`student_id`,`weekday`);--> statement-breakpoint
ALTER TABLE `students` ADD `name_is_provisional` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `students` ADD `age_range` text;--> statement-breakpoint
ALTER TABLE `students` ADD `gender` text;--> statement-breakpoint
ALTER TABLE `students` ADD `directions` text;--> statement-breakpoint
ALTER TABLE `students` ADD `located_at` text;--> statement-breakpoint
UPDATE `students` SET "located_at" = "created_at" WHERE "latitude" IS NOT NULL AND "longitude" IS NOT NULL;--> statement-breakpoint
INSERT INTO `stage_changes`("id", "student_id", "from_stage", "to_stage", "changed_at", "created_at", "updated_at", "sync_status") SELECT lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-' || substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))), "id", NULL, "stage", "created_at", "created_at", "created_at", 'pending' FROM `students` WHERE "deleted_at" IS NULL;--> statement-breakpoint
INSERT INTO `pauses`("id", "student_id", "reason", "paused_at", "created_at", "updated_at", "sync_status") SELECT lower(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-' || substr('89ab', 1 + (abs(random()) % 4), 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))), "id", 'other', "updated_at", "updated_at", "updated_at", 'pending' FROM `students` WHERE "status" = 'paused' AND "deleted_at" IS NULL;