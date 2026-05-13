import { Router, type IRouter } from "express";
import { dashboardController } from "./dashboard.controller";
import { checkAdminAuth } from "../../middleware/checkAuth";

const dashboardRouter: IRouter = Router();

dashboardRouter.get("/stats", checkAdminAuth, dashboardController.getStats);

export default dashboardRouter;
