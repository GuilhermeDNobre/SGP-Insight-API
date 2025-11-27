import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Name of the department',
    example: 'Logistics',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Location or branch of the department',
    example: 'Headquarters - North Wing',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Full name of the department responsable',
    example: 'Maria Clara Santos',
  })
  @IsNotEmpty()
  @IsString()
  responsableName: string;

  @ApiProperty({
    description: 'Email of the department responsable',
    example: 'maria.santos@company.com',
  })
  @IsNotEmpty()
  @IsEmail()
  responsableEmail: string;
}
