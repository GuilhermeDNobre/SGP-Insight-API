import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { MaintenanceStatus, UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MaintenanceFiltersDto } from './dto/maintenance-filters.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';


@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  //qm pode postar e so o user
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER', 'ADMIN')
  @ApiOperation({ summary: 'Create a new maintenance' })
  async create(@Body() dto: CreateMaintenanceDto) {
    return this.maintenanceService.create(dto);
  }

  //GET COM CARRYS
  @Get()
  @ApiOperation({ summary: 'List all maintenances (with optional filters & pagination)' })
  @ApiQuery({ name: 'equipmentId', required: false })
  @ApiQuery({ name: 'departmentId', required: false })
  @ApiQuery({ name: 'status', enum: MaintenanceStatus, required: false })
  @ApiQuery({ name: 'onlyActive', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(@Query() query: MaintenanceFiltersDto) {
    return this.maintenanceService.findAll(query);
  }

  //get por equipamentos
  @Get('equipment/:equipmentId')
  @ApiOperation({ summary: 'List maintenances of a specific equipment' })
  @ApiBody({ type: UpdateMaintenanceDto })
  async findByEquipment(@Param('equipmentId') equipmentId: string, @Body() dto: UpdateMaintenanceDto) {
    return //carry findall paginada
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMaintenanceDto: UpdateMaintenanceDto) {
  //   return this.maintenanceService.update(+id, updateMaintenanceDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.maintenanceService.remove(+id);
  // }
}
