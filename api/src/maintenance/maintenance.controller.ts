import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { MaintenanceStatus, UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
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
  @ApiBearerAuth()
  @Roles('USER', 'ADMIN')
  @ApiOperation({ summary: 'Create a new maintenance' })
  async create(@Body() dto: CreateMaintenanceDto) {
    return this.maintenanceService.create(dto);
  }

  //GET COM CARRYS
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List maintenances of a specific equipment' })
  @ApiBody({ type: UpdateMaintenanceDto })
  async findByEquipment(@Param('equipmentId') equipmentId: string, @Body() dto: UpdateMaintenanceDto) {
    return //carry findall paginada
  }


  @Patch(':id/start')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark maintenance as IN_PROGRESS' })
  async start(@Param('id') id: string) {
    return this.maintenanceService.update(id, { status: MaintenanceStatus.EM_ANDAMENTO });
  }

  
  @Patch(':id/finish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark maintenance as DONE' })
  async finish(@Param('id') id: string, @Body() body?: { finishedAt?: Date }) {
    return this.maintenanceService.update(id, {
      status: MaintenanceStatus.TERMINADA,
      finishedAt: body?.finishedAt ? new Date(body.finishedAt) : new Date(),
    });
  }

}
