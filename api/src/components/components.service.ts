import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ComponentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateComponentDto) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id: dto.equipmentId },
    });

    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }

    return this.prisma.component.create({
      data: {
        name: dto.name,
        status: dto.status,
        equipment: {
          connect: { id: dto.equipmentId }
        },
      },
    });
  }

  async findAll() {
    return this.prisma.component.findMany({
      where: { discardedAt: null },
      include: { equipment: true },
    });
  }

  async findByEquipment(equipmentId: string) {
    return this.prisma.component.findMany({
      where: { equipmentId, discardedAt: null},
    });
  }

  async findOne(id: string) {
    const component = await this.prisma.component.findUnique({
      where: { id },
      include: { equipment: true },
    });

    if (!component) throw new NotFoundException('Component not found');
    return component;
  }

  async update(id: string, dto: UpdateComponentDto) {
    return this.prisma.component.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const component = await this.prisma.component.findUnique({ where: { id } });

    if (!component) {
      throw new NotFoundException('Component not found');
    }

    return this.prisma.component.update({
      where: { id },
      data: { discardedAt: new Date() },
    });
  }
}
