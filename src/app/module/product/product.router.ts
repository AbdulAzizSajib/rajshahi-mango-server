import { Router, type IRouter } from "express";
import { productController } from "./product.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { checkAdminAuth } from "../../middleware/checkAuth";
import { multerUpload } from "../../config/multer.config";
import { createProductSchema, updateProductSchema } from "./product.validation";

const productRouter: IRouter = Router();

// Public
productRouter.get("/", productController.getAllProducts);
productRouter.get("/:id", productController.getProductById);

// Admin only
productRouter.post(
  "/",
  checkAdminAuth,
  multerUpload.single("image"),
  validateRequest(createProductSchema),
  productController.createProduct,
);

productRouter.patch(
  "/:id",
  checkAdminAuth,
  multerUpload.single("image"),
  validateRequest(updateProductSchema),
  productController.updateProduct,
);

productRouter.delete("/:id", checkAdminAuth, productController.deleteProduct);

export default productRouter;
