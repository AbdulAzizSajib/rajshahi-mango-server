import { z } from "zod";
import { prisma } from "../../lib/prisma";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
  approveTestimonialSchema,
  featureTestimonialSchema,
} from "./testimonial.validation";

type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
type ApproveTestimonialInput = z.infer<typeof approveTestimonialSchema>;
type FeatureTestimonialInput = z.infer<typeof featureTestimonialSchema>;

const createTestimonial = async (data: CreateTestimonialInput) => {
  return prisma.testimonial.create({
    data: {
      name: data.name,
      comment: data.comment,
      location: data.location,
      date: data.date ?? null,
    },
  });
};

// Public: only approved testimonials
const getApprovedTestimonials = async () => {
  return prisma.testimonial.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" },
  });
};

// Admin: all testimonials
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

const approveTestimonial = async (id: string, data: ApproveTestimonialInput) => {
  return prisma.testimonial.update({
    where: { id },
    data: { isApproved: data.isApproved },
  });
};

const featureTestimonial = async (id: string, data: FeatureTestimonialInput) => {
  return prisma.testimonial.update({
    where: { id },
    data: { isFeatured: data.isFeatured },
  });
};

const deleteTestimonial = async (id: string) => {
  return prisma.testimonial.delete({ where: { id } });
};

export const testimonialService = {
  createTestimonial,
  getApprovedTestimonials,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  approveTestimonial,
  featureTestimonial,
  deleteTestimonial,
};
