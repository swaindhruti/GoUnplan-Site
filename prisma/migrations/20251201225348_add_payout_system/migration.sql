-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'FAILED');

-- CreateTable
CREATE TABLE "payouts" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "firstPaymentAmount" INTEGER NOT NULL,
    "firstPaymentDate" TIMESTAMP(3) NOT NULL,
    "firstPaymentStatus" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "firstPaymentPaidAt" TIMESTAMP(3),
    "secondPaymentAmount" INTEGER NOT NULL,
    "secondPaymentDate" TIMESTAMP(3) NOT NULL,
    "secondPaymentStatus" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "secondPaymentPaidAt" TIMESTAMP(3),
    "firstPaymentPercent" INTEGER NOT NULL DEFAULT 20,
    "secondPaymentPercent" INTEGER NOT NULL DEFAULT 80,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payouts_hostId_idx" ON "payouts"("hostId");

-- CreateIndex
CREATE INDEX "payouts_firstPaymentDate_idx" ON "payouts"("firstPaymentDate");

-- CreateIndex
CREATE INDEX "payouts_secondPaymentDate_idx" ON "payouts"("secondPaymentDate");

-- CreateIndex
CREATE UNIQUE INDEX "payouts_bookingId_key" ON "payouts"("bookingId");

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
