import { Router, type IRouter } from "express";
import { orderController } from "./order.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createOrderSchema } from "./order.validation";
import { checkAdminAuth } from "../../middleware/checkAuth";

const orderRouter: IRouter = Router();

// Public — customer places order
orderRouter.post("/", validateRequest(createOrderSchema), orderController.createOrder);

// Admin only
orderRouter.get("/", checkAdminAuth, orderController.getAllOrders);
orderRouter.get("/:id", checkAdminAuth, orderController.getOrderById);
orderRouter.delete("/:id", checkAdminAuth, orderController.deleteOrder);

export default orderRouter;
