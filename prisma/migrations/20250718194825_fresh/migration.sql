/*
  Warnings:

  - The `precautions` column on the `diseases` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "diseases" DROP COLUMN "precautions",
ADD COLUMN     "precautions" TEXT[];
