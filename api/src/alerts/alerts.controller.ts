import { Controller, Get, Param, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiOperation({ summary: 'List all alerts' })
  @ApiOkResponse({
    description: 'Array of alerts',
    schema: { type: 'array', items: { type: 'object' } },
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('quarter') quarter?: string,
    @Query('occurrenceCount') occurrenceCount?: string,
    @Query('startDate') startDate?: string, 
    @Query('endDate') endDate?: string,
  ) {
    return this.alertsService.findAll(
      Number(page || 1),
      Number(limit || 10),
      search,
      quarter ? Number(quarter) : undefined,
      occurrenceCount ? Number(occurrenceCount) : undefined,
      startDate,
      endDate
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an alert by id' })
  @ApiParam({ name: 'id', required: true, description: 'Alert id (UUID)' })
  @ApiOkResponse({ description: 'Alert found', schema: { type: 'object' } })
  @ApiNotFoundResponse({ description: 'Alert not found' })
  findOne(@Param('id') id: string) {
    return this.alertsService.findOne(id);
  }
}
