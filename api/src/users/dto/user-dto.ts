import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserDto {
  @ApiProperty({ description: 'UUID of the user', example: 'b47c4a6f-3e21-44c3-8a0e-6f71b568f218' })
  id: string;

  @ApiProperty({ description: 'Email of the user', example: 'user@email.com' })
  email: string;

  @ApiProperty({ description: 'First name of the user', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'Role of the user', example: 'MANAGER', enum: Role })
  role: Role;
}
