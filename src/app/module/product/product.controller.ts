import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { productService } from "./product.service";
import AppError from "../../errorHelpers/AppError";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const product = await productService.createProduct(req.body, files);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Product created successfully.",
    data: product,
  });
});

const getAllProducts = catchAsync(async (_req: Request, res: Response) => {
  const products = await productService.getAllProducts();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Products fetched successfully.",
    data: products,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  const product = await productService.getProductById(id);
  if (!product) throw new AppError(status.NOT_FOUND, "Product not found.");
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Product fetched successfully.",
    data: product,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  const files = req.files as Express.Multer.File[];
  const product = await productService.updateProduct(id, req.body, files);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Product updated successfully.",
    data: product,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  await productService.deleteProduct(id);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Product deleted successfully.",
  });
});

export const productController = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
