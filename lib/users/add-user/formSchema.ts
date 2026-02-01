// formSchema.ts
import { z } from "zod";

export const formSchema = z
  .object({
    Name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    StartDate: z.date({
      required_error: "Start date is required",
      invalid_type_error: "Start date must be a valid date",
    }),
    ExpiredDate: z.date({
      required_error: "Expiry date is required",
      invalid_type_error: "Expiry date must be a valid date",
    }),
  })
  .refine(
    (data) => {
      return data.StartDate < data.ExpiredDate;
    },
    {
      message: "Expiry date must be after start date",
      path: ["ExpiredDate"],
    },
  );