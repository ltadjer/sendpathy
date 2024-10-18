/*
  Warnings:

  - You are about to drop the column `user1Id` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `user2Id` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `user1Id` on the `Friendship` table. All the data in the column will be lost.
  - You are about to drop the column `user2Id` on the `Friendship` table. All the data in the column will be lost.
  - The `status` column on the `Friendship` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[requesterId,receiverId]` on the table `Friendship` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverId` to the `Friendship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requesterId` to the `Friendship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Friendship` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('PRIVATE', 'GROUP');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'BLOCKED');

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_user2Id_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_user2Id_fkey";

-- DropIndex
DROP INDEX "Conversation_user1Id_user2Id_key";

-- DropIndex
DROP INDEX "Friendship_user1Id_user2Id_key";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "user1Id",
DROP COLUMN "user2Id",
ADD COLUMN     "conversationType" "ConversationType" NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "user1Id",
DROP COLUMN "user2Id",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "requesterId" TEXT NOT NULL,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "_ConversationUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ConversationUsers_AB_unique" ON "_ConversationUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ConversationUsers_B_index" ON "_ConversationUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_requesterId_receiverId_key" ON "Friendship"("requesterId", "receiverId");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationUsers" ADD CONSTRAINT "_ConversationUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationUsers" ADD CONSTRAINT "_ConversationUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
