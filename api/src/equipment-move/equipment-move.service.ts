import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipmentMoveDto } from './dto/create-equipment-move.dto';
import { UpdateEquipmentMoveDto } from './dto/update-equipment-move.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface MovimentsFilters{
    page?: number;
    limit?: number;
    equipmentId?: string;
    previouslyAlocatedAtId?: string;
    newlyAlocatedAtId?: string;
    orderBy?: string;
    sort?: 'asc' | 'desc';
}

@Injectable()
export class EquipmentMoveService {
  constructor(private prisma: PrismaService){}

  async create(dto: CreateEquipmentMoveDto) {
    const equipment = await this.prisma.equipment.findUnique({
      where: {id: dto.equipmentId}
    })

    if (!equipment) throw new NotFoundException('Equipment not found');

    //cria o move
    const move = await this.prisma.equipmentMove.create({
  data: {
    equipment: {connect: { id: dto.equipmentId },},
    previouslyAlocatedAt: {connect: { id: dto.previouslyAlocatedAtId },},
    newlyAlocatedAt: {connect: { id: dto.newlyAlocatedAtId },},
  },
});
    //da update no novo dept do equip
    await this.prisma.equipment.update({
      where: {id: dto.equipmentId},
      data: {alocatedAtId: dto.newlyAlocatedAtId}
    })

    return move
  }

  async findAll(filters: MovimentsFilters) {
    const {
      page = 1,
      limit = 10,
      equipmentId,
      previouslyAlocatedAtId,
      newlyAlocatedAtId,
      orderBy = 'createdAt',
      sort = 'desc',
    } = filters;

    const where: any = {
      equipmentId: equipmentId || undefined,
      previouslyAlocatedAtId: previouslyAlocatedAtId || undefined,
      newlyAlocatedAtId: newlyAlocatedAtId || undefined
    }

    const skip = (page - 1) * limit

    const moves = await this.prisma.equipmentMove.findMany({
      where,
      skip,
      take:limit,
      orderBy: {[orderBy]: sort},
      include: {
        equipment:{
          select: { id: true, name: true, ean: true},
        },
        previouslyAlocatedAt:{
          select: { id: true, name: true },
        },
        newlyAlocatedAt:{
          select: { id: true, name: true },
        }
      }
    });

    const total = await this.prisma.equipment.count({ where })

    return {
      data: moves,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        filters:{equipmentId, previouslyAlocatedAtId, newlyAlocatedAtId},
        orderBy,
        sort,
      },
    };
  }

  async findOne(id: string) {
    const move = await this.prisma.equipment.findUnique({ where: { id } });

    if (!move) throw new NotFoundException(`Equipment with id ${id} not found`);

    return move;
  }

  update(id: number, updateEquipmentMoveDto: UpdateEquipmentMoveDto) {
  
  }

  async remove(id: string) {
    const existing = await this.prisma.equipmentMove.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new HttpException('Equipment move not found', HttpStatus.NOT_FOUND);
    }

    return await this.prisma.equipmentMove.delete({
      where: { id },
    });;
}

}
