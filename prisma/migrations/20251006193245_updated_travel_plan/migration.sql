-- AlterTable
ALTER TABLE "travel_plans" ADD COLUMN     "stops" TEXT[] DEFAULT ARRAY[]::TEXT[];
