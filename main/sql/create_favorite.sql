CREATE TABLE `favorite` (
	`artist` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`song` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`julkaisuaika` DATE NULL DEFAULT NULL,
	`aika` DATETIME NULL DEFAULT NULL,
	`albumi` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci'
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;

