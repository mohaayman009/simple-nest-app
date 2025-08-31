/*
  Warnings:

  - You are about to drop the column `code` on the `otp` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `otp` table. All the data in the column will be lost.
  - Added the required column `otp` to the `otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."otp" DROP COLUMN "code",
DROP COLUMN "phone",
ADD COLUMN     "otp" TEXT NOT NULL;
