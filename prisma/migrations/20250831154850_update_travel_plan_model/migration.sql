-- AlterTable
ALTER TABLE "travel_plans" ADD COLUMN     "activities" TEXT[] DEFAULT ARRAY[]::TEXT[];
