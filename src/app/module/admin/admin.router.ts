import { Router, type IRouter } from "express";
import { adminController } from "./admin.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { adminLoginSchema } from "./admin.validation";

const adminRouter: IRouter = Router();

adminRouter.post("/login", validateRequest(adminLoginSchema), adminController.login);

export default adminRouter;
