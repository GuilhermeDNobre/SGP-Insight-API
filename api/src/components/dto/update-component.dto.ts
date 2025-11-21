import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateComponentDto } from './create-component.dto';
import { ComponentStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateComponentDto extends PartialType(CreateComponentDto) {
    @ApiPropertyOptional({
        enum: ComponentStatus,
        example: ComponentStatus.EM_MANUTENCAO,
        description: 'Novo status do componente (opcional)',
    })
    @IsOptional()
    @IsEnum(ComponentStatus)
    status?: ComponentStatus;
}
