import { z } from "zod";

export const todoSchema = z.object({
  title: z
    .string()
    .nonempty("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    // .nonempty("Description is required")
    .min(5, "Description must be at least 5 characters"),
});
