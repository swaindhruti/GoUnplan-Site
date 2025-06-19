/*
  Warnings:

  - A unique constraint covering the columns `[hostEmail]` on the table `host_profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pricePerPerson` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostEmail` to the `host_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hostMobile` to the `host_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'REFUNDED';

-- DropForeignKey
ALTER TABLE "travel_plans" DROP CONSTRAINT "travel_plans_hostId_fkey";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "pricePerPerson" INTEGER NOT NULL,
ADD COLUMN     "refundAmount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "host_profiles" ADD COLUMN     "hostEmail" TEXT NOT NULL,
ADD COLUMN     "hostMobile" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "travel_plans" ADD COLUMN     "maxParticipants" INTEGER NOT NULL DEFAULT 10;

-- CreateIndex
CREATE UNIQUE INDEX "host_profiles_hostEmail_key" ON "host_profiles"("hostEmail");

-- AddForeignKey
ALTER TABLE "travel_plans" ADD CONSTRAINT "travel_plans_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "host_profiles"("hostId") ON DELETE CASCADE ON UPDATE CASCADE;
