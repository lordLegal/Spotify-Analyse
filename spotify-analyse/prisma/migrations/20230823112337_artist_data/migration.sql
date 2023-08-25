-- CreateTable
CREATE TABLE `ARTIST_DATA` (
    `id_artist_data` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_id_artist` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `monthly_listeners` INTEGER NULL,
    `data_count` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id_artist_data`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ARTIST_DATA` ADD CONSTRAINT `ARTIST_DATA_fk_id_artist_fkey` FOREIGN KEY (`fk_id_artist`) REFERENCES `ARTIST`(`id_artits`) ON DELETE RESTRICT ON UPDATE CASCADE;
