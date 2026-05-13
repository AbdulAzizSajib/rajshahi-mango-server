import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { orderService } from "./order.service";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.createOrder(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Order placed successfully.",
    data: order,
  });
});

const getAllOrders = catchAsync(async (_req: Request, res: Response) => {
  const orders = await orderService.getAllOrders();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Orders fetched successfully.",
    data: orders,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  const order = await orderService.getOrderById(id);
  if (!order) throw new AppError(status.NOT_FOUND, "Order not found.");
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Order fetched successfully.",
    data: order,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  await orderService.deleteOrder(id);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Order deleted successfully.",
  });
});

export const orderController = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
};
