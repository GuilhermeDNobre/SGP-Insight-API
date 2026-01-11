import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, IsEnum } from 'class-validator';
import { EquipmentStatus } from '@prisma/client';

export class CreateEquipmentDto {
  @ApiProperty({ description: 'Name of the equipment', example: 'Impressora HP LaserJet 1200' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'EAN or serial code of the equipment', example: '7891234567890' })
  @IsNotEmpty()
  @IsString()
  ean: string;

  @ApiProperty({ description: 'ID of the department where the equipment is currently allocated', example: 'c1b4d3f2-0b7e-4a3e-b2e1-2a9a7f22b0c5' })
  @IsNotEmpty()
  @IsUUID()
  alocatedAtId: string;

  @ApiProperty({ description: 'Initial status of the equipment', enum: EquipmentStatus, example: EquipmentStatus.ATIVO, required: false })
  @IsOptional()
  @IsEnum(EquipmentStatus)
  status?: EquipmentStatus;
}
