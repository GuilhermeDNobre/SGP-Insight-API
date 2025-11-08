import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({description: 'User email', example: 'user@email.com'})
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({description: 'User password', example: 'user12345'})
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({description: 'User first name', example: 'John'})
  @IsString()
  @IsNotEmpty()
  firstName: string;
}
