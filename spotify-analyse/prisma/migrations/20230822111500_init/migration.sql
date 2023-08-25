-- CreateTable
CREATE TABLE `USER` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `spotify_id` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `image` VARCHAR(255) NULL,

    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `API_USER` (
    `id_api_u` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_id_user_api` INTEGER NOT NULL,
    `access_token` VARCHAR(255) NULL,
    `refreshtoken` VARCHAR(255) NULL,
    `expries_at` INTEGER NULL,
    `scope` VARCHAR(255) NULL,

    PRIMARY KEY (`id_api_u`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TRADE_USER` (
    `id_trade_u` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_id_user` INTEGER NOT NULL,
    `coins` INTEGER NULL DEFAULT 10000,
    `coins_invested` INTEGER NULL DEFAULT 0,
    `coins_earned` INTEGER NULL DEFAULT 0,
    `coins_lost` INTEGER NULL DEFAULT 0,
    `coins_invested_total` INTEGER NULL DEFAULT 0,
    `coins_earned_total` INTEGER NULL DEFAULT 0,
    `coins_lost_total` INTEGER NULL DEFAULT 0,

    UNIQUE INDEX `TRADE_USER_fk_id_user_key`(`fk_id_user`),
    PRIMARY KEY (`id_trade_u`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ARTIST` (
    `id_artits` INTEGER NOT NULL AUTO_INCREMENT,
    `spotify_id` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `image` VARCHAR(255) NULL,
    `monthly_listeners` INTEGER NULL DEFAULT 0,
    `last_monthly_listeners` INTEGER NULL DEFAULT 0,
    `changed_date` DATETIME(3) NULL,

    PRIMARY KEY (`id_artits`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `INVEST_ARTIST` (
    `id_invest_a` INTEGER NOT NULL AUTO_INCREMENT,
    `fk_id_user` INTEGER NOT NULL,
    `fk_id_artist` INTEGER NOT NULL,
    `coins` INTEGER NULL,

    PRIMARY KEY (`id_invest_a`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `API_USER` ADD CONSTRAINT `API_USER_fk_id_user_api_fkey` FOREIGN KEY (`fk_id_user_api`) REFERENCES `USER`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TRADE_USER` ADD CONSTRAINT `TRADE_USER_fk_id_user_fkey` FOREIGN KEY (`fk_id_user`) REFERENCES `USER`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `INVEST_ARTIST` ADD CONSTRAINT `INVEST_ARTIST_fk_id_user_fkey` FOREIGN KEY (`fk_id_user`) REFERENCES `USER`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `INVEST_ARTIST` ADD CONSTRAINT `INVEST_ARTIST_fk_id_artist_fkey` FOREIGN KEY (`fk_id_artist`) REFERENCES `ARTIST`(`id_artits`) ON DELETE RESTRICT ON UPDATE CASCADE;
