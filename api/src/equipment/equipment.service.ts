import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { PrismaService } from "src/prisma/prisma.service";
import { EquipmentStatus } from '@prisma/client';
import { take } from 'rxjs';

interface EquipmentFilters {
  page?: number;
  limit?: number;
  name?: string;
  ean?: string;
  alocatedAtId?: string;
  status?: string | EquipmentStatus;
  orderBy?: string;
  sort?: 'asc' | 'desc';
  search?: string;
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
  
  private mapToPrismaStatus(status?: string | EquipmentStatus): EquipmentStatus | null {
    if (!status) return null;
    const s = String(status).toLowerCase();
    if (s === 'active' || s === 'ativo' || s === 'ATIVO'.toLowerCase()) return 'ATIVO';
    if (s === 'maintenance' || s === 'em_manutencao' || s === 'em manutencao' || s === 'em_manutencão') return 'EM_MANUTENCAO';
    if (s === 'disabled' || s === 'desabilitado') return 'DESABILITADO';
    // accept direct Prisma enum values as well
    if (['ATIVO','EM_MANUTENCAO','DESABILITADO'].includes(String(status).toUpperCase())) return String(status).toUpperCase() as EquipmentStatus;
    return null;
  }
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
    

    // map optional status to Prisma enum values and adjust disabledAt if needed
    const dtoStatus = (dto as any).status as EquipmentStatus | undefined;
    const prismaStatus = this.mapToPrismaStatus(dtoStatus) ?? 'ATIVO';
    const data: any = {
      ...normalizedDto,
      createdAt: new Date(),
    };

    if (prismaStatus === 'DESABILITADO') {
      data.disabledAt = new Date();
    } else {
      data.disabledAt = null;
    }

    // persist status field if exists in schema (some setups store it explicitly)
    // persist status field (Prisma schema defines it)
    data.status = prismaStatus;

    return this.prisma.equipment.create({ data });

  }


  //rever depois os filtros
  async findAll(filters: EquipmentFilters) {
    const{
      page = 1,
      limit = 10,
      name,
      ean,
      alocatedAtId,
      status,
      orderBy = 'createdAt',
      sort = 'desc',
      search,
    } = filters

    const where: any = {
      name: name ? { contains: name, mode: 'insensitive' } : undefined,
      ean: ean ? { contains: ean, mode: 'insensitive' } : undefined,
      alocatedAtId: alocatedAtId || undefined,
      // disabled will be set below based on `status` filter
    }
    
    if (search) {
      const normalizedSearch = normalizeString(search);
      
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { ean: { contains: search, mode: 'insensitive' } },
      ];
    } else {
      if (name) where.name = { contains: name, mode: 'insensitive' };
      if (ean) where.ean = { contains: ean, mode: 'insensitive' };
    }

    const skip = (page - 1) * limit

    // Apply status filter mapping (map input to Prisma enum)
    const prismaStatusFilter = this.mapToPrismaStatus(status);
    if (prismaStatusFilter) {
      // filter directly by equipment.status enum
      where.status = prismaStatusFilter;
    }

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
        filters: {name, ean, alocatedAtId, status, search},
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

    // remove fields that should not be directly updated via this endpoint
    delete (updateData as any).createdAt;
    delete (updateData as any).disabledAt;

    return this.prisma.equipment.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Set equipment status to a value from `EquipmentStatus` enum (ATIVO | EM_MANUTENCAO | DESABILITADO).
   * This persists `status` on the Equipment record and updates `disabledAt` when appropriate.
   */
  async setStatus(id: string, status: EquipmentStatus) {
    const equipment = await this.prisma.equipment.findUnique({ where: { id } });

    if (!equipment) throw new HttpException('Equipment not found', HttpStatus.NOT_FOUND);

    const data: any = {};
    const prismaStatus = this.mapToPrismaStatus(status);
    if (!prismaStatus) throw new HttpException('Invalid status', HttpStatus.BAD_REQUEST);

    if (prismaStatus === 'DESABILITADO') {
      if (equipment.status === 'DESABILITADO') throw new HttpException('Equipment already disabled', HttpStatus.BAD_REQUEST);
      data.disabledAt = new Date();
    } else if (prismaStatus === 'ATIVO') {
      data.disabledAt = null;
    } else if (prismaStatus === 'EM_MANUTENCAO') {
      // Do not toggle disabledAt for maintenance; maintenance is represented by Maintenance records
    }

    // persist status field (schema now contains `status` enum)
    data.status = prismaStatus;

    return this.prisma.equipment.update({ where: { id }, data });
  }

  //DASHBOARD OPERATIONS
  async countAll(){
    return {
      total: await this.prisma.equipment.count()
    };
  }

  async countInMaintenance() {
    const total = await this.prisma.equipment.count({
      where: {
        status: EquipmentStatus.EM_MANUTENCAO,
      },
    });

    return { total };
  }

  async countAvailable() {
    const available = await this.prisma.equipment.count({
      where: {
        status: EquipmentStatus.ATIVO,
      },
    });

    return { available };
  
  }

  async countByDepartment() {
    const departments = await this.prisma.department.findMany();
    const departmentCounts = await Promise.all(
      departments.map(async (department) => {
        const count = await this.prisma.equipment.count({
          where: {
            alocatedAtId: department.id,
          },
        });
        return {
          id: department.id,
          name: department.name,
          count,
        };
      }),
    );

    return { departments: departmentCounts };
  }

  async countEquipmentStatus(): Promise<Record<string, number>> {
  const groups: any[] = await this.prisma.equipment.groupBy({
    by: ['status'],
    _count: { _all: true },
  } as any);

  const counts: Record<string, number> = {
    ATIVO: 0,
    EM_MANUTENCAO: 0,
    DESABILITADO: 0,
  };

  for (const g of groups) {
    const status = String(g.status).toUpperCase();
    counts[status] = g._count?._all ?? 0;
  }

  return counts;
}
}
