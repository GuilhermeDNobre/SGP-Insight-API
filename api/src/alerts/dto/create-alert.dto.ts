import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum AlertSeverity {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
}

export class CreateAlertDto {
	@ApiProperty({ description: 'Alert severity', enum: AlertSeverity, example: AlertSeverity.LOW })
	@IsEnum(AlertSeverity)
	@IsOptional() // Prisma provides a default (LOW); allow omission on create
	severity?: AlertSeverity;

	@ApiProperty({ description: 'Alert description', example: 'Temperature exceeded threshold' })
	@IsString()
	@IsNotEmpty()
	description: string;
}
