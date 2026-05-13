import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { envVars } from "../config/env";

export const checkAdminAuth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(status.UNAUTHORIZED, "No token provided.");
    }

    const token = authHeader.slice(7);
    const payload = jwt.verify(token, envVars.JWT_SECRET) as { email: string };

    req.admin = { email: payload.email };
    next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    next(new AppError(status.UNAUTHORIZED, "Invalid or expired token."));
  }
};
