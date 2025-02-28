/*
  Warnings:

  - You are about to drop the column `userId` on the `recipe` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `recipe` DROP FOREIGN KEY `Recipe_userId_fkey`;

-- DropIndex
DROP INDEX `Recipe_userId_fkey` ON `recipe`;

-- AlterTable
ALTER TABLE `recipe` DROP COLUMN `userId`,
    ADD COLUMN `authorId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
