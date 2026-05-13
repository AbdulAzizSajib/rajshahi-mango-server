import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { testimonialService } from "./testimonial.service";
import AppError from "../../errorHelpers/AppError";

const createTestimonial = catchAsync(async (req: Request, res: Response) => {
  const testimonial = await testimonialService.createTestimonial(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Testimonial created successfully.",
    data: testimonial,
  });
});

const getAllTestimonials = catchAsync(async (_req: Request, res: Response) => {
  const testimonials = await testimonialService.getAllTestimonials();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Testimonials fetched successfully.",
    data: testimonials,
  });
});

const getTestimonialById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  const testimonial = await testimonialService.getTestimonialById(id);
  if (!testimonial) throw new AppError(status.NOT_FOUND, "Testimonial not found.");
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Testimonial fetched successfully.",
    data: testimonial,
  });
});

const updateTestimonial = catchAsync(async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  const testimonial = await testimonialService.updateTestimonial(id, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Testimonial updated successfully.",
    data: testimonial,
  });
});

const deleteTestimonial = catchAsync(async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  await testimonialService.deleteTestimonial(id);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Testimonial deleted successfully.",
  });
});

export const testimonialController = {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
};
