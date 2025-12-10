import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EquipmentStatus } from '@prisma/client';
import { EquipmentFiltersDto } from './dto/equipment-filters.dto';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiBody({type: CreateEquipmentDto})
  @ApiOperation({ summary: 'Create a new equipment' })
  create(@Body() dto: CreateEquipmentDto) {
    return this.equipmentService.create(dto)
  }


  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all equipments (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'ean', required: false, type: String })
  @ApiQuery({ name: 'alocatedAtId', required: false, type: String })
  @ApiQuery({ name: 'status', enum: EquipmentStatus, required: false, description: "Filter by equipment status: 'ATIVO' | 'EM_MANUTENCAO' | 'DESABILITADO'", type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(@Query() query: EquipmentFiltersDto) {
    const { page, limit, name, ean, alocatedAtId, status, search } = query;

    return this.equipmentService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      name: name || undefined,
      ean: ean || undefined,
      alocatedAtId: alocatedAtId || undefined,
      status: status || undefined,
      search: search || undefined,
    });
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get one equipment by ID' })
  findOne(@Param('id') id: string) {
    return this.equipmentService.findOne(id)
  }


  // @Get(':id/history')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get equipment history by ID' })
  // getHistory(@Param('id') id: string){
  //   // return this.equipmentService.
  // }


  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateEquipmentDto })
  @ApiOperation({ summary: 'Update an existing equipment by ID (All JSON camps are optional)' })
  update(@Param('id') id: string, @Body() dto: UpdateEquipmentDto) {
    return this.equipmentService.update(id, dto);
  }


  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change equipment status (ATIVO | EM_MANUTENCAO | DESABILITADO)' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', enum: ['ATIVO','EM_MANUTENCAO','DESABILITADO'] } } } })
  changeStatus(@Param('id') id: string, @Body('status') status: EquipmentStatus) {
    return this.equipmentService.setStatus(id, status as any);
  }


}
