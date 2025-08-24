-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PARTIALLY_PAID', 'FULLY_PAID', 'OVERDUE', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('PARTIAL', 'FULL', 'REFUND');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "amountPaid" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "minPaymentAmount" INTEGER,
ADD COLUMN     "paymentDeadline" TIMESTAMP(3),
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "remainingAmount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "partial_payments" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentType" "PaymentType" NOT NULL DEFAULT 'PARTIAL',

    CONSTRAINT "partial_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "partial_payments" ADD CONSTRAINT "partial_payments_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
