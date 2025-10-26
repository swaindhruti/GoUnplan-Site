/*
  Warnings:

  - You are about to drop the column `plannedHostingMonth` on the `host_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "host_profiles" DROP COLUMN "plannedHostingMonth",
ADD COLUMN     "plannedHostingMonths" TEXT[] DEFAULT ARRAY[]::TEXT[];
