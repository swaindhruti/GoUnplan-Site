-- CreateEnum
CREATE TYPE "GenderPreference" AS ENUM ('MALE_ONLY', 'FEMALE_ONLY', 'MIX');

-- AlterTable
ALTER TABLE "travel_plans" ADD COLUMN     "genderPreference" "GenderPreference" NOT NULL DEFAULT 'MIX';
