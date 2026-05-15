import { prisma } from "../../lib/prisma";
import { z } from "zod";
import { createOrderSchema, updateOrderStatusSchema } from "./order.validation";

type CreateOrderInput = z.infer<typeof createOrderSchema>;
type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

const createOrder = async (data: CreateOrderInput) => {
  const { items, ...orderData } = data;

  const order = await prisma.order.create({
    data: {
      ...orderData,
      notes: orderData.notes ?? null,
      policeStation: orderData.policeStation ?? null,
      deliveryDate: orderData.deliveryDate ? new Date(orderData.deliveryDate) : null,
      paymentMethod: orderData.paymentMethod ?? null,
      transactionId: orderData.transactionId ?? null,
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

const updateOrderStatus = async (id: string, data: UpdateOrderStatusInput) => {
  return prisma.order.update({
    where: { id },
    data: { status: data.status },
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
  updateOrderStatus,
  deleteOrder,
};
