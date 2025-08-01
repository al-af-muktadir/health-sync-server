/*
  Warnings:

  - You are about to drop the column `precaution` on the `diseases` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "diseases" DROP COLUMN "precaution",
ADD COLUMN     "precautions" TEXT;
