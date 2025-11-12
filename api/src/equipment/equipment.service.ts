import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { PrismaService } from "src/prisma/prisma.service";
import { take } from 'rxjs';

interface EquipmentFilters {
  page?: number;
  limit?: number;
  name?: string;
  ean?: string;
  alocatedAtId?: string;
  onlyActive?: boolean;
  orderBy?: string;
  sort?: 'asc' | 'desc';
}

function normalizeString(str: string): string {
  return str
    .normalize('NFD')                 
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C')
    .toLowerCase();                  
}

@Injectable()
export class EquipmentService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateEquipmentDto) {
    const normalizedDto = {
      ...dto,
      name: normalizeString(dto.name),
      ean: normalizeString(dto.ean),
      alocatedAtId: normalizeString(dto.alocatedAtId),
    }

    const existing = await this.prisma.equipment.findUnique({
      where: {ean: normalizedDto.ean},
    });
    if (existing) throw new HttpException(`Equipment with EAN '${normalizedDto.ean}' already exists`, HttpStatus.CONFLICT)
    

    const department = await this.prisma.department.findUnique({
      where: { id: normalizedDto.alocatedAtId }
    });
    if (!department) throw new HttpException(`Department '${normalizedDto.alocatedAtId}' not found`, HttpStatus.BAD_REQUEST)
    

    return this.prisma.equipment.create({
      data: {
        ...normalizedDto,
        disabled: false,
        createdAt: new Date()
      },
    });

  }


  //rever depois os filtros
  async findAll(filters: EquipmentFilters) {
    const{
      page = 1,
      limit = 10,
      name,
      ean,
      alocatedAtId,
      onlyActive,
      orderBy = 'createdAt',
      sort = 'desc',
    } = filters

    const where: any = {
      name: name ? { contains: name, mode: 'insensitive' } : undefined,
      ean: ean ? { contains: ean, mode: 'insensitive' } : undefined,
      alocatedAtId: alocatedAtId || undefined,
      disabled: onlyActive ? false : undefined,
    }
    
    const skip = (page - 1) * limit

    const equipments = await this.prisma.equipment.findMany({
      where,
      skip,
      take: limit,
      orderBy: {[orderBy]: sort}, 
      include: {
        alocatedAt: true,
      }
    });

    const total = await this.prisma.equipment.count({ where })

    return{
      data: equipments,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        filters: {name, ean, alocatedAtId, onlyActive},
        orderBy,
        sort,
      },
    };
  }

  async findOne(id: string) {
    const equipment = await this.prisma.equipment.findUnique({ where: { id } });

    if (!equipment) throw new NotFoundException(`Equipment with id ${id} not found`);

    return equipment;
  }

  async update(id: string, dto: UpdateEquipmentDto) {
    const existing = await this.prisma.equipment.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpException('Equipment not found', HttpStatus.NOT_FOUND);
    }

    const updateData: Partial<UpdateEquipmentDto> = {}

    if (dto.name) updateData.name = normalizeString(dto.name)
    if (dto.ean) updateData.ean = normalizeString(dto.ean)
    if (dto.alocatedAtId) {
      const department = await this.prisma.department.findUnique({
        where: { id: dto.alocatedAtId },
      });

      if (!department) throw new HttpException(`Department '${dto.alocatedAtId}' not found`, HttpStatus.BAD_REQUEST)
      
      updateData.alocatedAtId = dto.alocatedAtId
    }

    delete (updateData as any).disabled;
    delete (updateData as any).createdAt;
    delete (updateData as any).disabledAt;

    return this.prisma.equipment.update({
      where: { id },
      data: updateData,
    });
  }

  async softRemove(id: string){
    const equipment = await this.prisma.equipment.findUnique({ where: { id } });

    if (!equipment) throw new HttpException('Equipment not found', HttpStatus.NOT_FOUND);
    if (equipment.disabled) throw new HttpException('Equipment already disabled', HttpStatus.BAD_REQUEST);
    
    return this.prisma.equipment.update({
      where: { id },
      data: {
        disabled: true,
        disabledAt: new Date(),
      }
    });
  }
}
