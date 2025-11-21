/*
  Warnings:

  - The `status` column on the `Component` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ComponentStatus" AS ENUM ('OK', 'EM_MANUTENCAO');

-- AlterTable
ALTER TABLE "Component" DROP COLUMN "status",
ADD COLUMN     "status" "ComponentStatus" NOT NULL DEFAULT 'OK';
