import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsUUID } from "class-validator"

export class CreateEquipmentMoveDto {

    @ApiProperty({ description: '' })
    @IsUUID()
    @IsNotEmpty()
    equipmentId:string

    @ApiProperty({ description: '' })
    @IsUUID()
    @IsNotEmpty()
    previouslyAlocatedAtId:string

    @ApiProperty({ description: '' })
    @IsUUID()
    @IsNotEmpty()
    newlyAlocatedAtId: string

}
