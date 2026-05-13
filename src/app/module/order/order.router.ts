import { Router, type IRouter } from "express";
import { orderController } from "./order.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createOrderSchema, updateOrderStatusSchema } from "./order.validation";
import { checkAdminAuth } from "../../middleware/checkAuth";

const orderRouter: IRouter = Router();

// Public — customer places order
orderRouter.post("/", validateRequest(createOrderSchema), orderController.createOrder);

// Admin only
orderRouter.get("/", checkAdminAuth, orderController.getAllOrders);
orderRouter.get("/:id", checkAdminAuth, orderController.getOrderById);
orderRouter.patch(
  "/:id/status",
  checkAdminAuth,
  validateRequest(updateOrderStatusSchema),
  orderController.updateOrderStatus,
);
orderRouter.delete("/:id", checkAdminAuth, orderController.deleteOrder);

export default orderRouter;
