CREATE TABLE `pessoas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`numero` integer NOT NULL,
	`nome` text NOT NULL,
	`pago` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pessoas_numero_unique` ON `pessoas` (`numero`);