/*
  Warnings:

  - You are about to drop the column `disabled` on the `Equipment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('ATIVO', 'EM_MANUTENCAO', 'DESABILITADO');

-- AlterTable
ALTER TABLE "Equipment" DROP COLUMN "disabled",
ADD COLUMN     "status" "EquipmentStatus" NOT NULL DEFAULT 'ATIVO';
