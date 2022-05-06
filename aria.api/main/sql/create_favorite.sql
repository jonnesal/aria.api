Säilytämmä tietokannan create koodia täällä


CREATE TABLE `favorite` (
                            `artist` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
                            `song` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
                            `aika` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci'
)
    COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;

