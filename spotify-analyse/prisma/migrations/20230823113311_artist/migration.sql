/*
  Warnings:

  - You are about to drop the column `changed_date` on the `artist` table. All the data in the column will be lost.
  - You are about to drop the column `last_monthly_listeners` on the `artist` table. All the data in the column will be lost.
  - You are about to drop the column `monthly_listeners` on the `artist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `artist` DROP COLUMN `changed_date`,
    DROP COLUMN `last_monthly_listeners`,
    DROP COLUMN `monthly_listeners`;
