import z, { email } from "zod";

export const formSchema = z.object({
  Name: z.string().min(1, "First name is required"),
  email: email("Invalid email address"),
  StartDate: z.string().min(1, "Start date is required"),
  ExpiredDate: z.string().min(1, "Expiry date is required"),
});
