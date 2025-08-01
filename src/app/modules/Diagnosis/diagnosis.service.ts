import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createDisease = async (
  payloads: {
    name: string;
    description: string;
    precautions: string[];
    specialtyId: string;
  }[]
) => {
  console.log("Creating multiple diseases...");

  const result = await Promise.all(
    payloads.map((payload) =>
      prisma.disease.create({
        data: payload,
      })
    )
  );

  return result;
};

const getDoctorsByDiseaseName = async (diseaseName: string) => {
  console.log("Fetching disease by name:", diseaseName);
  const disease = await prisma.disease.findMany({
    where: { name: diseaseName },
    select: { specialtyId: true },
  });
  console.log("Disease found:", disease);

  if (!disease || disease.length === 0) {
    throw new Error("Disease not found");
  }

  // Find doctors with that specialtyId
  const specialtyId = disease[0].specialtyId;
  const doctors = await prisma.doctor.findMany({
    where: { specialtyId: specialtyId, isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      contactNumber: true,
      profilePhoto: true,
      qualification: true,
      designation: true,
      currentWorkingPlace: true,
      experience: true,
      gender: true,
      appointmentFee: true,
      registrationNumber: true,
    },
  });

  return doctors;
};

export const DiseaseService = {
  createDisease,
  getDoctorsByDiseaseName,
};
