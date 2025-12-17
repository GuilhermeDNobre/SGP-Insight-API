/*
  Warnings:

  - You are about to drop the column `trimester` on the `Alerts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Alerts" DROP COLUMN "trimester",
ADD COLUMN     "trimestre" INTEGER;
