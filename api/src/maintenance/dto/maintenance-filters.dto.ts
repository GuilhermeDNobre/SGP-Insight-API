import { IsOptional, IsUUID, IsEnum, IsBoolean, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export enum MaintenanceStatus {
  ABERTA = 'ABERTA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  TERMINADA = 'TERMINADA',
}
//ficou feio, mas é o que resolveu por enquanto o problema de importação do enum do prisma 2

export class MaintenanceFiltersDto {
  @IsOptional()
  @IsString()
  search?: string;
  
  @IsOptional()
  @IsUUID()
  equipmentId?: string;

  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @IsOptional()
  @IsBoolean()
  onlyOpen?: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}
