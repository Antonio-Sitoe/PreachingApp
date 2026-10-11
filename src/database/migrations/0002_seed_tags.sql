-- Etiquetas de origem. Os ids são fixos para serem iguais em todos os telemóveis.
INSERT OR IGNORE INTO `tags` (`id`, `name`, `created_at`, `updated_at`, `sync_status`) VALUES
	('7c0f9d2a-1b3e-4c5d-8e6f-000000000001', 'Pregação', '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z', 'pending'),
	('7c0f9d2a-1b3e-4c5d-8e6f-000000000002', 'Reflexão', '2026-01-01T00:00:01.000Z', '2026-01-01T00:00:01.000Z', 'pending'),
	('7c0f9d2a-1b3e-4c5d-8e6f-000000000003', 'Devocional', '2026-01-01T00:00:02.000Z', '2026-01-01T00:00:02.000Z', 'pending');
--> statement-breakpoint
UPDATE `notes` SET `tag_id` = (SELECT `id` FROM `tags` WHERE `tags`.`name` = `notes`.`tag`) WHERE `tag` IS NOT NULL;
