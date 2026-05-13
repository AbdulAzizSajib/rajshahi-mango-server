import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { envVars } from "../../config/env";
import { prisma } from "../../lib/prisma";
import status from "http-status";

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const admin = await prisma.admin.findUnique({ where: { email } });

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    throw new AppError(status.UNAUTHORIZED, "Invalid credentials.");
  }

  const token = jwt.sign({ email: admin.email, id: admin.id }, envVars.JWT_SECRET, {
    expiresIn: envVars.JWT_EXPIRES_IN as string,
  } as jwt.SignOptions);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Login successful.",
    data: { token },
  });
});

export const adminController = { login };
