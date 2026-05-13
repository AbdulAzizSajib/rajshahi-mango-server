import { Router, type IRouter } from "express";
import { testimonialController } from "./testimonial.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAdminAuth } from "../../middleware/checkAuth";
import {
  createTestimonialSchema,
  updateTestimonialSchema,
} from "./testimonial.validation";

const testimonialRouter: IRouter = Router();

// Public
testimonialRouter.get("/", testimonialController.getAllTestimonials);
testimonialRouter.get("/:id", testimonialController.getTestimonialById);

// Admin only
testimonialRouter.post(
  "/",
  checkAdminAuth,
  validateRequest(createTestimonialSchema),
  testimonialController.createTestimonial,
);

testimonialRouter.patch(
  "/:id",
  checkAdminAuth,
  validateRequest(updateTestimonialSchema),
  testimonialController.updateTestimonial,
);

testimonialRouter.delete("/:id", checkAdminAuth, testimonialController.deleteTestimonial);

export default testimonialRouter;
