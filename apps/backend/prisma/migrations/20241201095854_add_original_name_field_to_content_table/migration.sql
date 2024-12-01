/*
  Warnings:

  - Added the required column `originalName` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Content` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "originalName" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;
