/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "imageUrl",
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "profileImage" TEXT;
