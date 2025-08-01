-- CreateTable
CREATE TABLE "doctor_diseases" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "diseaseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor_diseases_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctor_diseases_doctorId_diseaseId_key" ON "doctor_diseases"("doctorId", "diseaseId");

-- AddForeignKey
ALTER TABLE "doctor_diseases" ADD CONSTRAINT "doctor_diseases_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor_diseases" ADD CONSTRAINT "doctor_diseases_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "diseases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
