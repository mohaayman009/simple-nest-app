/*
  Warnings:

  - Added the required column `userId` to the `generatedOtp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."generatedOtp" ADD COLUMN     "userId" INTEGER NOT NULL;
