// useAddUser.ts
"use client";

import { formSchema } from "@/lib/users/add-user/formSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useAddUser = () => {
  const router = useRouter();
  const createUser = useMutation(api.users.createUser);
  const generateShareableLink = useMutation(api.generateShareableLink.generateShareableLink);
  const [generatedLink, setGeneratedLink] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      email: "",
      password: "",
      StartDate: undefined,
      ExpiredDate: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Convert dates to timestamps (UTC start of day to avoid timezone issues)
      const startDate = data.StartDate ? 
        Date.UTC(
          data.StartDate.getFullYear(),
          data.StartDate.getMonth(),
          data.StartDate.getDate()
        ) : undefined;
      
      const expiryDate = data.ExpiredDate ? 
        Date.UTC(
          data.ExpiredDate.getFullYear(),
          data.ExpiredDate.getMonth(),
          data.ExpiredDate.getDate()
        ) : undefined;

      // Create user in Convex
      const result = await createUser({
        name: data.Name,
        email: data.email,
        password: data.password,
        startDate,
        expiryDate,
      });

      if (result.success) {
        toast.success("User created successfully!");
        form.reset();
        router.push("/users");
      } else {
        toast.error("Failed to create user. Email may already be in use.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("An error occurred while creating the user.");
    }
  };

  const onGenerateLink = async () => {
    try {
      // Only validate StartDate and ExpiredDate for link generation
      const isValid = await form.trigger(['StartDate', 'ExpiredDate']);

      if (!isValid) {
        // Get all errors to see what's wrong
        const errors = form.formState.errors;
        console.log("Form validation errors:", errors);
        
        if (errors.StartDate) {
          toast.error(`Start date error: ${errors.StartDate.message}`);
        }
        if (errors.ExpiredDate) {
          toast.error(`Expiry date error: ${errors.ExpiredDate.message}`);
        }
        return;
      }

      // Get validated form values
      const formValues = form.getValues();
      const startDateValue = formValues.StartDate;
      const expiryDateValue = formValues.ExpiredDate;

      if (!startDateValue || !expiryDateValue) {
        toast.error("Please select both start date and expiry date");
        return;
      }

      // Convert dates to timestamps (UTC start of day)
      const startDate = Date.UTC(
        startDateValue.getFullYear(),
        startDateValue.getMonth(),
        startDateValue.getDate()
      );
      
      const expiryDate = Date.UTC(
        expiryDateValue.getFullYear(),
        expiryDateValue.getMonth(),
        expiryDateValue.getDate()
      );

      // Generate shareable link
      const result = await generateShareableLink({
        startDate,
        expiryDate,
      });

      if (result.success && result.token) {
        // Generate full URL
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/register/${result.token}`;
        setGeneratedLink(link);
        toast.success("Shareable link generated successfully!");
      } else {
        toast.error(result.error || "Failed to generate link");
      }
    } catch (error) {
      console.error("Error generating link:", error);
      toast.error("An error occurred while generating the link");
    }
  };

  return {
    form,
    onSubmit,
    onGenerateLink,
    generatedLink,
  };
};