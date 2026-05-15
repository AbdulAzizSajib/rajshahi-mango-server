import z from "zod";

const orderItemSchema = z.object({
  variety: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "returned",
    "refunded",
  ]),
});

export const createOrderSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  district: z.string().min(1),
  policeStation: z.string().optional(),
  deliveryType: z.enum(["courier", "home"]),
  deliveryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }).optional(),
  notes: z.string().optional(),
  subtotal: z.number().positive(),
  total: z.number().positive(),
  paymentMethod: z.enum(["bkash", "nagad"]).optional(),
  transactionId: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});
