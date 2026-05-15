import { z } from "zod";

export const createTestimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  comment: z.string().min(1, "Comment is required"),
  location: z.string().min(1, "Location is required"),
  date: z.coerce.date().optional(),
});

export const updateTestimonialSchema = createTestimonialSchema.partial();

export const approveTestimonialSchema = z.object({
  isApproved: z.boolean(),
});

export const featureTestimonialSchema = z.object({
  isFeatured: z.boolean(),
});
