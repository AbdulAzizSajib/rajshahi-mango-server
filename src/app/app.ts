import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFoundMiddleware } from "./middleware/notFound";
import { envVars } from "./config/env";
import orderRouter from "./module/order/order.router";
import adminRouter from "./module/admin/admin.router";
import productRouter from "./module/product/product.router";
import testimonialRouter from "./module/testimonial/testimonial.router";
import heroBannerRouter from "./module/heroBanner/heroBanner.router";
import dashboardRouter from "./module/dashboard/dashboard.router";

const app: Express = express();

app.use(
  cors({
    origin: [envVars.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173", "https://rajshahimango.vercel.app", "https://rajshahimango.site"  ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).send("Rajshahi Mango Server is running...");
});

app.use("/orders", orderRouter);
app.use("/admin", adminRouter);
app.use("/products", productRouter);
app.use("/testimonials", testimonialRouter);
app.use("/hero-banners", heroBannerRouter);
app.use("/dashboard", dashboardRouter);

app.use(globalErrorHandler);
app.use(notFoundMiddleware);

export default app;
