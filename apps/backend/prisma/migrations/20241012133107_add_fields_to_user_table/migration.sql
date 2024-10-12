/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "biography" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "nativeLanguage" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "username" TEXT;
