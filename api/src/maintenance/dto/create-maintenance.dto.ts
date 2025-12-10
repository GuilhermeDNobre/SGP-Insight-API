import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaintenanceDto {
  @ApiProperty({
    example: "Rodrigo Almeida",
    description: "Nome do técnico responsável pela manutenção",
  })
  @IsString()
  technician: string;

  @ApiProperty({
    example: "rodrigo.almeida@example.com ou (88) 99999-0000",
    description: "Contato do técnico (email ou celular)",
    required: false,
  })
  @IsOptional()
  @IsString()
  contact?: string;

  @ApiProperty({
    example: "Troca do cabo HDMI e limpeza interna do gabinete.",
    description: "Descrição detalhada da manutenção realizada",
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: "550e8400-e29b-41d4-a716-446655440000",
    description: "UUID do equipamento que está sendo submetido à manutenção",
  })
  @IsUUID()
  equipmentId: string;

  @ApiProperty({
    example: ["2b1a3c4d-0000-4e2f-a1d2-123456789abc", "9f8e7d6c-1111-5a4b-c3d2-abcdefabcdef"],
    description: "Lista de UUIDs de componentes afetados na manutenção. Todos devem pertencer ao mesmo Equipment informado.",
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  componentIds?: string[];
}
