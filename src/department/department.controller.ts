import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { get } from 'http';

import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiBody({type: CreateDepartmentDto})
  @ApiOperation({summary: 'Used by an ADMIN to register an department'})
  async create(@Body() dto: CreateDepartmentDto) {
    return await this.departmentService.createDepartment(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiBody({type: UpdateDepartmentDto})
  @ApiOperation({summary: 'Used by an ADMIN to update (edit) an department'})
  async update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto){
    return await this.departmentService.update(id, dto)
  }

  @Get()
  @ApiOperation({ summary: 'List all departments' })
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a department by its ID' })
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get a department by its name (case-insensitive)' })
  findByName(@Param('name') name: string) {
    return this.departmentService.findByName(name);
  }

  @Get('id-by-name/:name')
  @ApiOperation({ summary: 'Get a department ID using its name' })
  async findIdByName(@Param('name') name: string) {
    return this.departmentService.findIdByName(name);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a department by ID (Admin only)' })
  async remove(@Param('id') id: string) {
    return this.departmentService.remove(id);
  }
}
