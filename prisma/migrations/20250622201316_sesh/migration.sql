-- AlterTable
ALTER TABLE "doctor_schedules" ALTER COLUMN "isBooked" SET DEFAULT false,
ALTER COLUMN "appointmentId" DROP NOT NULL;
