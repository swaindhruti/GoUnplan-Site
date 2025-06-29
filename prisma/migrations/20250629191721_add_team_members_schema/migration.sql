-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "isteamLead" BOOLEAN NOT NULL,
    "phone" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "memberEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_id_fkey" FOREIGN KEY ("id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
