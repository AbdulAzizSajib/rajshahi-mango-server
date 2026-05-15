import { prisma } from "../../lib/prisma";

const getStats = async () => {
  const [
    // Orders
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

    // Revenue
    totalRevenueResult,
    pendingRevenueResult,

    // Delivery type
    courierOrders,
    homeOrders,

    // Payment
    bkashOrders,
    nagadOrders,

    // Products
    totalProducts,

    // Testimonials
    totalTestimonials,
    pendingTestimonials,
    featuredTestimonials,

    // Hero Banners
    totalBanners,
    activeBanners,

    // Recent orders
    recentOrders,
  ] = await Promise.all([
    // Order status counts
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

    // Revenue
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "delivered" },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["pending", "confirmed", "processing", "packed", "shipped", "out_for_delivery"] } },
    }),

    // Delivery type breakdown
    prisma.order.count({ where: { deliveryType: "courier" } }),
    prisma.order.count({ where: { deliveryType: "home" } }),

    // Payment method breakdown
    prisma.order.count({ where: { paymentMethod: "bkash" } }),
    prisma.order.count({ where: { paymentMethod: "nagad" } }),

    // Products
    prisma.product.count(),

    // Testimonials
    prisma.testimonial.count(),
    prisma.testimonial.count({ where: { isApproved: false } }),
    prisma.testimonial.count({ where: { isFeatured: true } }),

    // Hero banners
    prisma.heroBanner.count(),
    prisma.heroBanner.count({ where: { isActive: true } }),

    // Recent 5 orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        district: true,
        total: true,
        status: true,
        paymentMethod: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    orders: {
      total: totalOrders,
      byStatus: {
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
      byDeliveryType: {
        courier: courierOrders,
        home: homeOrders,
      },
      byPaymentMethod: {
        bkash: bkashOrders,
        nagad: nagadOrders,
      },
    },
    revenue: {
      realized: totalRevenueResult._sum.total ?? 0,
      pending: pendingRevenueResult._sum.total ?? 0,
    },
    products: {
      total: totalProducts,
    },
    testimonials: {
      total: totalTestimonials,
      pending: pendingTestimonials,
      featured: featuredTestimonials,
    },
    heroBanners: {
      total: totalBanners,
      active: activeBanners,
    },
    recentOrders,
  };
};

export const dashboardService = { getStats };
