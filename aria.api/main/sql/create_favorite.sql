CREATE TABLE `favorite` (
                            `artist` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
                            `song` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
                            `aika` DATETIME NULL DEFAULT NULL
)
    COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;

