/*
  Warnings:

  - The `document` column on the `activity_history` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "activity_history" DROP COLUMN "document",
ADD COLUMN     "document" TEXT[];
