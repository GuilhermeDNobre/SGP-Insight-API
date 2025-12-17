-- AlterTable
ALTER TABLE "Alerts" ADD COLUMN     "componentId" TEXT,
ADD COLUMN     "equipmentId" TEXT,
ADD COLUMN     "lastRecurrenceAt" TIMESTAMP(3),
ADD COLUMN     "maintenanceId" TEXT,
ADD COLUMN     "occurrenceCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "trimester" INTEGER;

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alerts" ADD CONSTRAINT "Alerts_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "Maintenance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
