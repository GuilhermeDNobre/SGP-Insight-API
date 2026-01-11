import { Module } from '@nestjs/common';
import { EquipmentMoveService } from './equipment-move.service';
import { EquipmentMoveController } from './equipment-move.controller';

@Module({
  controllers: [EquipmentMoveController],
  providers: [EquipmentMoveService],
})
export class EquipmentMoveModule {}
