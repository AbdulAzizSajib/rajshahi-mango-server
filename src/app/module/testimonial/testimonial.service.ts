import { z } from "zod";
import { prisma } from "../../lib/prisma";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
} from "./testimonial.validation";

type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;

const createTestimonial = async (data: CreateTestimonialInput) => {
  return prisma.testimonial.create({ data });
};

const getAllTestimonials = async () => {
  return prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
};

const getTestimonialById = async (id: string) => {
  return prisma.testimonial.findUnique({ where: { id } });
};

const updateTestimonial = async (id: string, data: UpdateTestimonialInput) => {
  const updateData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) updateData[key] = value;
  }
  return prisma.testimonial.update({ where: { id }, data: updateData });
};

const deleteTestimonial = async (id: string) => {
  return prisma.testimonial.delete({ where: { id } });
};

export const testimonialService = {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
};
