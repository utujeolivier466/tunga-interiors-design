CREATE TABLE `contact_inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(120) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`email` varchar(320),
	`spaceType` varchar(80) NOT NULL,
	`location` varchar(160),
	`budgetRange` varchar(48),
	`brief` text NOT NULL,
	`consentAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_inquiries_id` PRIMARY KEY(`id`)
);
