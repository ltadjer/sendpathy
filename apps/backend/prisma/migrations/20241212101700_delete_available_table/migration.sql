/*
  Warnings:

  - You are about to drop the column `availableSlotId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the `AvailableSlot` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endTime` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `therapistId` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AvailableSlot" DROP CONSTRAINT "AvailableSlot_therapistId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_availableSlotId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "availableSlotId",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "therapistId" TEXT NOT NULL;

-- DropTable
DROP TABLE "AvailableSlot";

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
