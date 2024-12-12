/*
  Warnings:

  - Added the required column `availableSlotId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "availableSlotId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_availableSlotId_fkey" FOREIGN KEY ("availableSlotId") REFERENCES "AvailableSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
