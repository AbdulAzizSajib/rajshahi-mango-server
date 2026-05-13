import { z } from "zod";

export const createTestimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  comment: z.string().min(1, "Comment is required"),
  location: z.string().min(1, "Location is required"),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();
