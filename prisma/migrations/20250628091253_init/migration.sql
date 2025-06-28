-- CreateTable
CREATE TABLE "day_wise_itineraries" (
    "id" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "activities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "meals" TEXT,
    "accommodation" TEXT,
    "travelPlanId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "day_wise_itineraries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "day_wise_itineraries" ADD CONSTRAINT "day_wise_itineraries_travelPlanId_fkey" FOREIGN KEY ("travelPlanId") REFERENCES "travel_plans"("travelPlanId") ON DELETE CASCADE ON UPDATE CASCADE;
