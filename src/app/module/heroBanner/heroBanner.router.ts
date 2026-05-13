import { Router, type IRouter } from "express";
import { heroBannerController } from "./heroBanner.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAdminAuth } from "../../middleware/checkAuth";
import { multerUpload } from "../../config/multer.config";
import {
  createHeroBannerSchema,
  updateHeroBannerSchema,
} from "./heroBanner.validation";

const heroBannerRouter: IRouter = Router();

const MAX_IMAGES = 10;

// Public
heroBannerRouter.get("/", heroBannerController.getAllHeroBanners);
heroBannerRouter.get("/:id", heroBannerController.getHeroBannerById);

// Admin only
heroBannerRouter.post(
  "/",
  checkAdminAuth,
  multerUpload.array("images", MAX_IMAGES),
  validateRequest(createHeroBannerSchema),
  heroBannerController.createHeroBanner,
);

heroBannerRouter.patch(
  "/:id",
  checkAdminAuth,
  multerUpload.array("images", MAX_IMAGES),
  validateRequest(updateHeroBannerSchema),
  heroBannerController.updateHeroBanner,
);

heroBannerRouter.delete("/:id", checkAdminAuth, heroBannerController.deleteHeroBanner);

export default heroBannerRouter;
