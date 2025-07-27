CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`avatar_image` text,
	`profile` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` text PRIMARY KEY NOT NULL,
	`hours` integer NOT NULL,
	`minutes` integer NOT NULL,
	`students` integer NOT NULL,
	`comments` text,
	`date` text NOT NULL,
	`year` text NOT NULL,
	`month` text NOT NULL,
	`day` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `visits` (
	`id` text PRIMARY KEY NOT NULL,
	`students_id` text NOT NULL,
	`notes` text,
	`publications` text,
	`biblical_texts` text,
	`result` text,
	`date_and_hours` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`students_id`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`age` text NOT NULL,
	`about` text,
	`telephone` text,
	`email` text,
	`gender` text NOT NULL,
	`address` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `student_availabilities` (
	`id` text PRIMARY KEY NOT NULL,
	`studentId` text NOT NULL,
	`weekday` integer NOT NULL,
	`hour` integer NOT NULL,
	`minute` integer NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`createdAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updatedAt` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON UPDATE no action ON DELETE no action
);
