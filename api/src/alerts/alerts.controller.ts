import { Controller, Get, Param } from '@nestjs/common';
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
  findAll() {
    return this.alertsService.findAll();
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
