import { prisma } from "../../lib/prisma";
import { z } from "zod";
import { createOrderSchema } from "./order.validation";

type CreateOrderInput = z.infer<typeof createOrderSchema>;

const createOrder = async (data: CreateOrderInput) => {
  const { items, ...orderData } = data;

  const order = await prisma.order.create({
    data: {
      ...orderData,
      notes: orderData.notes ?? null,
      deliveryDate: new Date(orderData.deliveryDate),
      items: {
        create: items,
      },
    },
    include: { items: true },
  });

  return order;
};

const getAllOrders = async () => {
  return prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
};

const getOrderById = async (id: string) => {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
};

const deleteOrder = async (id: string) => {
  return prisma.order.delete({ where: { id } });
};

export const orderService = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
};
