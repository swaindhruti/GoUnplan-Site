-- AlterTable
ALTER TABLE "host_profiles" ADD COLUMN     "languages" TEXT[] DEFAULT ARRAY[]::TEXT[];
