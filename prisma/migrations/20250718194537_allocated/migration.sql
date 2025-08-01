/*
  Warnings:

  - You are about to drop the `doctor_diseases` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "doctor_diseases" DROP CONSTRAINT "doctor_diseases_diseaseId_fkey";

-- DropForeignKey
ALTER TABLE "doctor_diseases" DROP CONSTRAINT "doctor_diseases_doctorId_fkey";

-- DropTable
DROP TABLE "doctor_diseases";
