"use client";

import { formSchema } from "@/lib/users/add-user/formSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

export const useAddUser = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      email: "",
      StartDate: "",
      ExpiredDate: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form Data:", data);
  };

  return {
    form,
    onSubmit,
  };
};
