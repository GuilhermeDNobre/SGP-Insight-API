import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateMaintenanceDto {
  @IsString()
  technician: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsString()
  description: string;

  @IsUUID()
  equipmentId: string;

  @IsOptional()
  @IsString({ each: true })
  componentIds?: string[]; 
}
