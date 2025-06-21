import { Request } from "express";
import { fileUploader } from "../../../shared/fileUploader";
import prisma from "../../../shared/Prisma";

const createSpecialtiesIntoDb = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary.secure_url;
  }
  const result = await prisma.specialties.create({
    data: req.body,
  });
  return result;
};
const getSpecialtiesFromDb = async () => {
  const result = await prisma.specialties.findMany();

  return result;
};
const deleteSpecialtiesFromDb = async (params: any) => {
  const result = await prisma.specialties.delete({
    where: {
      id: params,
    },
  });
  return result;
};

export const specialtiesService = {
  createSpecialtiesIntoDb,
  getSpecialtiesFromDb,
  deleteSpecialtiesFromDb,
};
