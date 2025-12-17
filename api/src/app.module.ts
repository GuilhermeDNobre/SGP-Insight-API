import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { DepartmentModule } from './department/department.module';
import { EquipmentModule } from './equipment/equipment.module';
import { EquipmentMoveModule } from './equipment-move/equipment-move.module';
import { ComponentsModule } from './components/components.module';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { AlertsModule } from './alerts/alerts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    AuthModule,
    DepartmentModule,
    EquipmentModule,
    EquipmentMoveModule,
    ComponentsModule,
    EmailModule,
    MaintenanceModule,
    AlertsModule
  ],
  controllers: [],
  providers: [EmailService],
})
export class AppModule {}
