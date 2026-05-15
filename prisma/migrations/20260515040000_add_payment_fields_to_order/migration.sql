-- CreateEnum (already exists in DB from previous partial apply)
DO $$ BEGIN
  CREATE TYPE "PaymentMethod" AS ENUM ('bkash', 'nagad');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable: add columns with temporary defaults for existing rows
ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'bkash',
  ADD COLUMN IF NOT EXISTS "transactionId" TEXT NOT NULL DEFAULT 'N/A';

-- Drop the defaults so new rows must supply values
ALTER TABLE "orders"
  ALTER COLUMN "paymentMethod" DROP DEFAULT,
  ALTER COLUMN "transactionId" DROP DEFAULT;
