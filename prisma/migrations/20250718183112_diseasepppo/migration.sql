/*
  Warnings:

  - You are about to drop the `doctor_specialties` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `specialtyId` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_specialitiesId_fkey";

-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "specialtyId" TEXT NOT NULL;

-- DropTable
DROP TABLE "doctor_specialties";

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
