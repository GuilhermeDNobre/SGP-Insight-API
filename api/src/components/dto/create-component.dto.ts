import { ApiProperty } from "@nestjs/swagger";
import { ComponentStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateComponentDto {
    @ApiProperty({
        example: 'Placa de Vídeo RTX 3060',
        description: 'Nome do componente',
    })
    @IsString()
    name: string;

    @ApiProperty({
        enum: ComponentStatus,
        example: ComponentStatus.OK,
        description: 'Status atual do componente',
    })
    @IsEnum(ComponentStatus, { message: 'Status must be one of: OK, EM_MANUTENCAO' })
    status: ComponentStatus;

     @ApiProperty({
        example: 'b21f9e67-97b3-4d2c-a49a-6cbd3b0d905d',
        description: 'ID do equipamento ao qual o componente pertence',
    })
    @IsUUID()
    equipmentId: string;
}
