import { z } from "zod";

const createSp = z.object({
  title: z.string({ required_error: "Title is Required" }),
});

export const SpecialtiesValidation = {
  createSp,
};
