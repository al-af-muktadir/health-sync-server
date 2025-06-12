import { z } from "zod";

const createAdmin = z.object({
  password: z.string({ required_error: "Password is required" }),
  admin: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    contactNumber: z.string({ required_error: "Contact number is required" }),
  }),
});

export const userValidation = {
  createAdmin,
};
