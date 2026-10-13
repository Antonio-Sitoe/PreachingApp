UPDATE `notes` SET `tag_id` = NULL, `sync_status` = 'pending' WHERE `tag_id` = '7c0f9d2a-1b3e-4c5d-8e6f-000000000003';
--> statement-breakpoint
DELETE FROM `tags` WHERE `id` = '7c0f9d2a-1b3e-4c5d-8e6f-000000000003';
