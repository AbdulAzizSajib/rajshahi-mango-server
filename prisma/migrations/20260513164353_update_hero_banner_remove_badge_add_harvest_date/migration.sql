/*
  Warnings:

  - You are about to drop the column `badgeDate` on the `hero_banners` table. All the data in the column will be lost.
  - You are about to drop the column `badgeText` on the `hero_banners` table. All the data in the column will be lost.
  - You are about to drop the column `footerText` on the `hero_banners` table. All the data in the column will be lost.
  - You are about to drop the column `plateIndex` on the `hero_banners` table. All the data in the column will be lost.
  - You are about to drop the column `plateTotal` on the `hero_banners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "hero_banners" DROP COLUMN "badgeDate",
DROP COLUMN "badgeText",
DROP COLUMN "footerText",
DROP COLUMN "plateIndex",
DROP COLUMN "plateTotal",
ADD COLUMN     "harvestDate" TIMESTAMP(3);
