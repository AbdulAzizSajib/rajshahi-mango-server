import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { dashboardService } from "./dashboard.service";

const getStats = catchAsync(async (_req: Request, res: Response) => {
  const stats = await dashboardService.getStats();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Dashboard stats fetched successfully.",
    data: stats,
  });
});

export const dashboardController = { getStats };
