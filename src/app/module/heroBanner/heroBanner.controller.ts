import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { heroBannerService } from "./heroBanner.service";
import AppError from "../../errorHelpers/AppError";

const createHeroBanner = catchAsync(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const banner = await heroBannerService.createHeroBanner(req.body, files);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Hero banner created successfully.",
    data: banner,
  });
});

const getAllHeroBanners = catchAsync(async (_req: Request, res: Response) => {
  const banners = await heroBannerService.getAllHeroBanners();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Hero banners fetched successfully.",
    data: banners,
  });
});

const getHeroBannerById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  const banner = await heroBannerService.getHeroBannerById(id);
  if (!banner) throw new AppError(status.NOT_FOUND, "Hero banner not found.");
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Hero banner fetched successfully.",
    data: banner,
  });
});

const updateHeroBanner = catchAsync(async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const banner = await heroBannerService.updateHeroBanner(id, req.body, files);
  if (!banner) throw new AppError(status.NOT_FOUND, "Hero banner not found.");
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Hero banner updated successfully.",
    data: banner,
  });
});

const deleteHeroBanner = catchAsync(async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  await heroBannerService.deleteHeroBanner(id);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Hero banner deleted successfully.",
  });
});

export const heroBannerController = {
  createHeroBanner,
  getAllHeroBanners,
  getHeroBannerById,
  updateHeroBanner,
  deleteHeroBanner,
};
