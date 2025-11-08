import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

function normalizeString(str: string): string {
  return str
    .normalize('NFD')                 
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C')
    .toLowerCase();                  
}

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

 async createDepartment(dto: CreateDepartmentDto) {
  const normalizedDto = {
    ...dto,
    name: normalizeString(dto.name),
    location: normalizeString(dto.location),
    responsableName: normalizeString(dto.responsableName),
    responsableEmail: dto.responsableEmail.toLowerCase(), 
  };

  const existing = await this.prisma.department.findUnique({
    where: { name: normalizedDto.name },
  });
  if (existing) throw new HttpException('Department already exists', HttpStatus.BAD_REQUEST);

  return await this.prisma.department.create({
    data: normalizedDto,
  });
}

async update(id: string, dto: UpdateDepartmentDto) {
  
  const updateData: Partial<UpdateDepartmentDto> = {};
  if (dto.name) updateData.name = normalizeString(dto.name);
  if (dto.location) updateData.location = normalizeString(dto.location);
  if (dto.responsableName) updateData.responsableName = normalizeString(dto.responsableName);
  if (dto.responsableEmail) updateData.responsableEmail = dto.responsableEmail.toLowerCase();

  return await this.prisma.department.update({
    where: { id },
    data: updateData,
  });
}


  async findAll() {
  return await this.prisma.department.findMany();
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({ where: { id } });
    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
    return department;
  }

  async findIdByName(name: string) {
  const department = await this.findByName(name);
  return { id: department.id };
}

  async remove(id: string) {
    const department = await this.prisma.department.findUnique({ where: { id } });
    if (!department) {
      throw new NotFoundException(`Department with id "${id}" not found`);
    }

    return await this.prisma.department.delete({ where: { id } });  
  }

  async findByName(name: string) {
    const department = await this.prisma.department.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (!department) {
      throw new NotFoundException(`Department with name "${name}" not found`);
    }

    return department;
  }

}
