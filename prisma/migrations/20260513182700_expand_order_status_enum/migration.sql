-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'processing';
ALTER TYPE "OrderStatus" ADD VALUE 'packed';
ALTER TYPE "OrderStatus" ADD VALUE 'shipped';
ALTER TYPE "OrderStatus" ADD VALUE 'out_for_delivery';
ALTER TYPE "OrderStatus" ADD VALUE 'delivered';
ALTER TYPE "OrderStatus" ADD VALUE 'returned';
ALTER TYPE "OrderStatus" ADD VALUE 'refunded';
