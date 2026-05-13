import { Router, type IRouter } from "express";
import { testimonialController } from "./testimonial.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAdminAuth } from "../../middleware/checkAuth";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
  approveTestimonialSchema,
  featureTestimonialSchema,
} from "./testimonial.validation";

const testimonialRouter: IRouter = Router();

// Public: user submit testimonial
testimonialRouter.post(
  "/",
  validateRequest(createTestimonialSchema),
  testimonialController.createTestimonial,
);

// Public: only approved testimonials for UI
testimonialRouter.get("/", testimonialController.getApprovedTestimonials);
testimonialRouter.get("/:id", testimonialController.getTestimonialById);

// Admin only
testimonialRouter.get(
  "/admin/all",
  checkAdminAuth,
  testimonialController.getAllTestimonials,
);

testimonialRouter.patch(
  "/:id/approve",
  checkAdminAuth,
  validateRequest(approveTestimonialSchema),
  testimonialController.approveTestimonial,
);

testimonialRouter.patch(
  "/:id/feature",
  checkAdminAuth,
  validateRequest(featureTestimonialSchema),
  testimonialController.featureTestimonial,
);

testimonialRouter.patch(
  "/:id",
  checkAdminAuth,
  validateRequest(updateTestimonialSchema),
  testimonialController.updateTestimonial,
);

testimonialRouter.delete("/:id", checkAdminAuth, testimonialController.deleteTestimonial);

export default testimonialRouter;
