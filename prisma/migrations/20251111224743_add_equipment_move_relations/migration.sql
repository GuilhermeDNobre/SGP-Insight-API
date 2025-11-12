/*
  Warnings:

  - You are about to drop the column `newlyAlocatedAt` on the `EquipmentMove` table. All the data in the column will be lost.
  - You are about to drop the column `previouslyAlocatedAt` on the `EquipmentMove` table. All the data in the column will be lost.
  - Added the required column `newlyAlocatedAtId` to the `EquipmentMove` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previouslyAlocatedAtId` to the `EquipmentMove` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EquipmentMove" DROP COLUMN "newlyAlocatedAt",
DROP COLUMN "previouslyAlocatedAt",
ADD COLUMN     "newlyAlocatedAtId" TEXT NOT NULL,
ADD COLUMN     "previouslyAlocatedAtId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "EquipmentMove" ADD CONSTRAINT "EquipmentMove_previouslyAlocatedAtId_fkey" FOREIGN KEY ("previouslyAlocatedAtId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EquipmentMove" ADD CONSTRAINT "EquipmentMove_newlyAlocatedAtId_fkey" FOREIGN KEY ("newlyAlocatedAtId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
