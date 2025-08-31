-- AlterTable
ALTER TABLE "day_wise_itineraries" ADD COLUMN     "whatsSpecial" TEXT[] DEFAULT ARRAY[]::TEXT[];
