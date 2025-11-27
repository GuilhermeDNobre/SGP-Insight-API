import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';

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
  @ApiQuery({ name: 'onlyActive', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: Boolean })
  findAll(@Query() query: any) {
    const { page, limit, name, ean, alocatedAtId, onlyActive, search } = query;

    return this.equipmentService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      name: name || undefined,
      ean: ean || undefined,
      alocatedAtId: alocatedAtId || undefined,
      onlyActive: onlyActive === 'true' || false,
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


  @Patch(':id/disable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disable (soft delete) an equipment' })
  disable(@Param('id')id: string){
    return this.equipmentService.softRemove(id)
  }


}
