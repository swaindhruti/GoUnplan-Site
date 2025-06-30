/*
  Warnings:

  - A unique constraint covering the columns `[bookingId,memberEmail]` on the table `team_members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "team_members_bookingId_memberEmail_key" ON "team_members"("bookingId", "memberEmail");
