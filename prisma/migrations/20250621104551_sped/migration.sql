/*
  Warnings:

  - You are about to drop the `Specialties` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "doctor_specialties" DROP CONSTRAINT "doctor_specialties_specialitiesId_fkey";

-- DropTable
DROP TABLE "Specialties";

-- CreateTable
CREATE TABLE "specialties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "doctor_specialties" ADD CONSTRAINT "doctor_specialties_specialitiesId_fkey" FOREIGN KEY ("specialitiesId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
