import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo componente' })
  @ApiResponse({ status: 201, description: 'Componente criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 401, description: 'Usuário não autorizado' })
  @ApiResponse({ status: 404, description: 'Equipamento não encontrado' })
  @UseGuards(JwtAuthGuard)
  create(@Body() createComponentDto: CreateComponentDto) {
    return this.componentsService.create(createComponentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os componentes ativos (não descartados)' })
  @ApiResponse({ status: 200, description: 'Lista de componentes ativos' })
  @ApiResponse({ status: 401, description: 'Usuário não autorizado' })
  @ApiResponse({ status: 404, description: 'Nenhum componente encontrado' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.componentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lista componentes de um equipamento específico' })
  @ApiParam({
    name: 'equipmentId',
    description: 'ID do equipamento',
    example: '7b3a99d2-056b-4b0d-8a6b-2b564fe63e1a',
  })
  findOne(@Param('id') id: string) {
    return this.componentsService.findOne(id);
  }

  @Get('/equipment/:equipmentId')
  @ApiOperation({ summary: 'Lista componentes de um equipamento específico' })
  @ApiParam({
    name: 'equipmentId',
    description: 'ID do equipamento',
    example: '7b3a99d2-056b-4b0d-8a6b-2b564fe63e1a',
  })
  @ApiResponse({ status: 200, description: 'Lista de componentes do equipamento' })
  @ApiResponse({ status: 401, description: 'Usuário não autorizado' })
  findByEquipment(@Param('equipmentId') equipmentId: string) {
    return this.componentsService.findByEquipment(equipmentId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza informações de um componente' })
  @ApiParam({
    name: 'id',
    description: 'ID do componente',
  })
  @ApiResponse({ status: 200, description: 'Componente atualizado com sucesso' })
  update(@Param('id') id: string, @Body() updateComponentDto: UpdateComponentDto) {
    return this.componentsService.update(id, updateComponentDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Realiza um soft delete do componente (marca como descartado)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID do componente',
  })
  @ApiResponse({ status: 200, description: 'Componente marcado como descartado' })
  remove(@Param('id') id: string) {
    return this.componentsService.remove(id);
  }
}
