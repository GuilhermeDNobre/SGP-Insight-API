import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { DepartmentModule } from '../department/department.module';
import { EquipmentModule } from '../equipment/equipment.module';
import { MaintenanceModule } from '../maintenance/maintenance.module';

@Module({
  imports: [DepartmentModule, EquipmentModule, MaintenanceModule],
  providers: [ReportsService],
  controllers: [ReportsController]
})
export class ReportsModule {}
