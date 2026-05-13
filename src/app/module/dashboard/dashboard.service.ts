import { prisma } from "../../lib/prisma";

const getStats = async () => {
  const [
    totalOrders,
    pendingOrders,
    confirmedOrders,
    processingOrders,
    packedOrders,
    shippedOrders,
    outForDeliveryOrders,
    deliveredOrders,
    cancelledOrders,
    returnedOrders,
    refundedOrders,
    totalProducts,
    pendingTestimonials,
    revenueResult,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "confirmed" } }),
    prisma.order.count({ where: { status: "processing" } }),
    prisma.order.count({ where: { status: "packed" } }),
    prisma.order.count({ where: { status: "shipped" } }),
    prisma.order.count({ where: { status: "out_for_delivery" } }),
    prisma.order.count({ where: { status: "delivered" } }),
    prisma.order.count({ where: { status: "cancelled" } }),
    prisma.order.count({ where: { status: "returned" } }),
    prisma.order.count({ where: { status: "refunded" } }),
    prisma.product.count(),
    prisma.testimonial.count({ where: { isApproved: false } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "delivered" },
    }),
  ]);

  return {
    orders: {
      total: totalOrders,
      pending: pendingOrders,
      confirmed: confirmedOrders,
      processing: processingOrders,
      packed: packedOrders,
      shipped: shippedOrders,
      outForDelivery: outForDeliveryOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
      returned: returnedOrders,
      refunded: refundedOrders,
    },
    totalRevenue: revenueResult._sum.total ?? 0,
    totalProducts,
    pendingTestimonials,
  };
};

export const dashboardService = { getStats };
