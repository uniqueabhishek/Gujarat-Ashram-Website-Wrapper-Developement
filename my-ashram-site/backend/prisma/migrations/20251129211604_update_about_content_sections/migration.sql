/*
  Warnings:

  - You are about to drop the column `description` on the `AboutContent` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `AboutContent` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `AboutContent` table. All the data in the column will be lost.
  - Added the required column `aboutDescription` to the `AboutContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aboutTitle` to the `AboutContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `footerDescription` to the `AboutContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `footerTitle` to the `AboutContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heroDescription` to the `AboutContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heroSubtitle` to the `AboutContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `heroTitle` to the `AboutContent` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AboutContent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "aboutBadge" TEXT,
    "aboutTitle" TEXT NOT NULL,
    "aboutDescription" TEXT NOT NULL,
    "videoUrl" TEXT,
    "footerTitle" TEXT NOT NULL,
    "footerDescription" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_AboutContent" ("createdAt", "id", "updatedAt", "videoUrl") SELECT "createdAt", "id", "updatedAt", "videoUrl" FROM "AboutContent";
DROP TABLE "AboutContent";
ALTER TABLE "new_AboutContent" RENAME TO "AboutContent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
