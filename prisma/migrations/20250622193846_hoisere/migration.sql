/*
  Warnings:

  - You are about to drop the column `endTime` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `startData` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `endTimeTime` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "endTime",
DROP COLUMN "startData",
ADD COLUMN     "endTimeTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL;
