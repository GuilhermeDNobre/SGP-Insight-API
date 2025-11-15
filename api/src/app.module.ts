import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { DepartmentModule } from './department/department.module';
import { EquipmentModule } from './equipment/equipment.module';
import { EquipmentMoveModule } from './equipment-move/equipment-move.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    AuthModule,
    DepartmentModule,
    EquipmentModule,
    EquipmentMoveModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
