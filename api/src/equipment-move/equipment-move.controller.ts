import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { EquipmentMoveService } from './equipment-move.service';
import { CreateEquipmentMoveDto } from './dto/create-equipment-move.dto';
import { UpdateEquipmentMoveDto } from './dto/update-equipment-move.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';

@Controller('equipment-move')
export class EquipmentMoveController {
  constructor(private readonly equipmentMoveService: EquipmentMoveService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiBody({type: CreateEquipmentMoveDto})
  @ApiOperation({ summary: 'Create a new Equipment move' })
  create(@Body() dto: CreateEquipmentMoveDto) {
    return this.equipmentMoveService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all equipment moves (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'equipmentId', required: false, type: String })
  @ApiQuery({ name: 'previouslyAlocatedAtId', required: false, type: String })
  @ApiQuery({ name: 'newlyAlocatedAtId', required: false, type: String })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
  findAll(@Query() query: any) {
    const {
      page,
      limit,
      equipmentId,
      previouslyAlocatedAtId,
      newlyAlocatedAtId,
      orderBy,
      sort,
    } = query;

    return this.equipmentMoveService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      equipmentId: equipmentId || undefined,
      previouslyAlocatedAtId: previouslyAlocatedAtId || undefined,
      newlyAlocatedAtId: newlyAlocatedAtId || undefined,
      orderBy: orderBy || 'createdAt',
      sort: sort === 'desc' ? 'desc' : 'asc',
    });
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get equipment-move by id' })
  findOne(@Param('id') id: string) {
    return this.equipmentMoveService.findOne(id);
  }

  //Pra depois
  // @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @ApiBearerAuth()
  // update(@Param('id') id: string, @Body() updateEquipmentMoveDto: UpdateEquipmentMoveDto) {
  //   return this.equipmentMoveService.update(+id, updateEquipmentMoveDto);
  // }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a equipment move (admin only)' })
  remove(@Param('id') id: string) {
    return this.equipmentMoveService.remove(id);
  }
}
