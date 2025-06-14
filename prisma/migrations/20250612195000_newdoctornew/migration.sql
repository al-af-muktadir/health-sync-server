/*
  Warnings:

  - You are about to drop the column `exprerience` on the `doctors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "exprerience",
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0;
