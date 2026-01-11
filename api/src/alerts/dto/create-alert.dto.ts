import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsInt, Min, Max, IsDateString } from 'class-validator';

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

	@ApiProperty({ description: 'Related equipment id', required: false })
	@IsOptional()
	@IsUUID()
	equipmentId?: string;

	@ApiProperty({ description: 'Related component id', required: false })
	@IsOptional()
	@IsUUID()
	componentId?: string;

	@ApiProperty({ description: 'Related maintenance id', required: false })
	@IsOptional()
	@IsUUID()
	maintenanceId?: string;

	@ApiProperty({ description: 'Quarter (1-4)', required: false, example: 3 })
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(4)
	trimestre?: number;

	@ApiProperty({ description: 'Timestamp of last recurrence', required: false })
	@IsOptional()
	@IsDateString()
	lastRecurrenceAt?: string;

	@ApiProperty({ description: 'Number of occurrences for the same target', required: false, example: 0 })
	@IsOptional()
	@IsInt()
	@Min(0)
	occurrenceCount?: number;
}
