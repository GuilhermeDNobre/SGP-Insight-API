import { PartialType } from '@nestjs/mapped-types';
import { CreateMaintenanceDto } from './create-maintenance.dto';
import { IsOptional, IsEnum } from 'class-validator';

export enum MaintenanceStatus {
  ABERTA = 'ABERTA',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  TERMINADA = 'TERMINADA',
}
//ficou feio, mas é o que resolveu por enquanto o problema de importação do enum do prisma

export class UpdateMaintenanceDto extends PartialType(CreateMaintenanceDto) {
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;
}
