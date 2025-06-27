-- AlterTable
ALTER TABLE "host_profiles" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "travel_plans" ADD COLUMN     "destination" TEXT,
ADD COLUMN     "filters" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[];
