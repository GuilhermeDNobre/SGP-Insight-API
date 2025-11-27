-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('ABERTA', 'EM_ANDAMENTO', 'TERMINADA');

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL,
    "technician" TEXT NOT NULL,
    "contact" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'ABERTA',
    "equipmentId" TEXT NOT NULL,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceComponent" (
    "maintenanceId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,

    CONSTRAINT "MaintenanceComponent_pkey" PRIMARY KEY ("maintenanceId","componentId")
);

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceComponent" ADD CONSTRAINT "MaintenanceComponent_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "Maintenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceComponent" ADD CONSTRAINT "MaintenanceComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
