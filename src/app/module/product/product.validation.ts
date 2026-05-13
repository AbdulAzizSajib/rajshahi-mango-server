import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  regularprice: z.coerce.number().positive("Regular price must be positive"),
  offerPrice: z.coerce.number().positive("Offer price must be positive").optional(),
});

export const updateProductSchema = createProductSchema.partial();
