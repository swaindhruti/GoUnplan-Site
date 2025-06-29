/*
  Warnings:

  - Added the required column `bookingId` to the `team_members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "team_members" DROP CONSTRAINT "team_members_id_fkey";

-- AlterTable
ALTER TABLE "team_members" ADD COLUMN     "bookingId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
