import { PartialType } from '@nestjs/swagger';
import { CreateEquipmentMoveDto } from './create-equipment-move.dto';

export class UpdateEquipmentMoveDto extends PartialType(CreateEquipmentMoveDto) {}
