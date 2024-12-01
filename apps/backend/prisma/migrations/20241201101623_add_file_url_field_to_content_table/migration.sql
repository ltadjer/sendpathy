/*
  Warnings:

  - A unique constraint covering the columns `[fileUrl]` on the table `Content` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileUrl` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "fileUrl" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Content_fileUrl_key" ON "Content"("fileUrl");
