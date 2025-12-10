import { IsOptional, IsString, IsEnum, IsBooleanString } from 'class-validator';
import { EquipmentStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class EquipmentFiltersDto {
  @ApiPropertyOptional()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alocatedAtId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por nome exato ou parcial' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filtrar por EAN' })
  @IsOptional()
  @IsString()
  ean?: string;

  @ApiPropertyOptional({ description: 'Status separados por vírgula (ex: ATIVO,EM_MANUTENCAO)' })
  @IsOptional()
  @IsString() // Agora aceita qualquer string
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  onlyActive?: boolean;
}