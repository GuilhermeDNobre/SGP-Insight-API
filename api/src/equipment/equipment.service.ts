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
  onlyActive?: boolean;
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

  // Helper para mapear strings para o Enum do Prisma
  private mapToPrismaStatus(status?: string | EquipmentStatus): EquipmentStatus | null {
    if (!status) return null;
    const s = String(status).toUpperCase();
    
    if (s === 'ACTIVE' || s === 'ATIVO') return EquipmentStatus.ATIVO;
    if (['MAINTENANCE', 'EM_MANUTENCAO', 'EM MANUTENCAO'].includes(s)) return EquipmentStatus.EM_MANUTENCAO;
    if (['DISABLED', 'DESABILITADO'].includes(s)) return EquipmentStatus.DESABILITADO;
    
    // Aceita valores diretos do Enum
    if (Object.values(EquipmentStatus).includes(s as EquipmentStatus)) {
      return s as EquipmentStatus;
    }
    return null;
  }

  async create(dto: CreateEquipmentDto) {
    const normalizedDto = {
      ...dto,
      name: normalizeString(dto.name),
      ean: normalizeString(dto.ean),
      alocatedAtId: normalizeString(dto.alocatedAtId),
    };

    const existing = await this.prisma.equipment.findUnique({
      where: { ean: normalizedDto.ean },
    });
    
    if (existing) {
      throw new HttpException(`Equipment with EAN '${normalizedDto.ean}' already exists`, HttpStatus.CONFLICT);
    }

    const department = await this.prisma.department.findUnique({
      where: { id: normalizedDto.alocatedAtId },
    });
    
    if (!department) {
      throw new HttpException(`Department '${normalizedDto.alocatedAtId}' not found`, HttpStatus.BAD_REQUEST);
    }

    const dtoStatus = (dto as any).status as EquipmentStatus | undefined;
    const prismaStatus = this.mapToPrismaStatus(dtoStatus) ?? EquipmentStatus.ATIVO;

    // Preparação dos dados
    const data: any = {
      ...normalizedDto,
      status: prismaStatus,
      createdAt: new Date(),
      disabledAt: prismaStatus === EquipmentStatus.DESABILITADO ? new Date() : null,
    };

    return this.prisma.$transaction(async (tx) => {
      console.log('1. Iniciando transação...');
      
      const equipment = await tx.equipment.create({ data });
      console.log('2. Equipamento criado:', equipment.id);

      if (equipment.alocatedAtId) {
        console.log('3. Criando histórico para departamento:', equipment.alocatedAtId);
        await tx.equipmentMove.create({
          data: {
            equipmentId: equipment.id,
            previouslyAlocatedAtId: equipment.alocatedAtId,
            newlyAlocatedAtId: equipment.alocatedAtId,
            createdAt: new Date(),
          } as any
        });
        console.log('4. Histórico criado com sucesso.');
      }

      return equipment;
    });
  }

  async findAll(filters: EquipmentFilters) {
    console.log('Filtros Recebidos:', filters);
    console.log('Status Bruto:', filters.status);

    const {
      page = 1,
      limit = 10,
      name,
      ean,
      alocatedAtId,
      status,
      onlyActive,
      orderBy = 'createdAt',
      sort = 'desc',
      search,
    } = filters;

    const where: any = {
      name: name ? { contains: name, mode: 'insensitive' } : undefined,
      ean: ean ? { contains: ean, mode: 'insensitive' } : undefined,
      alocatedAtId: alocatedAtId || undefined,
    };

    if (status) {
      const statusList = status.split(','); 

      const validStatuses = statusList
        .map(s => this.mapToPrismaStatus(s.trim()))
        .filter(s => s !== null); // Remove inválidos

      if (validStatuses.length > 0) {
        where.status = { in: validStatuses };
      }
    } else if (onlyActive !== undefined) {
      // Retrocompatibilidade: se onlyActive for true, pega tudo que NÃO é desabilitado
      where.status = onlyActive ? { not: EquipmentStatus.DESABILITADO } : undefined;
    }

    console.log('Where Clause Final:', JSON.stringify(where, null, 2));

    if (search) {
      const normalizedSearch = normalizeString(search);
      where.OR = [
        { name: { contains: normalizedSearch, mode: 'insensitive' } },
        { ean: { contains: normalizedSearch, mode: 'insensitive' } },
      ];
    } else {
      if (name) where.name = { contains: name, mode: 'insensitive' };
      if (ean) where.ean = { contains: ean, mode: 'insensitive' };
    }

    const skip = (page - 1) * limit;

    const equipments = await this.prisma.equipment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [orderBy]: sort },
      include: {
        alocatedAt: true,
      },
    });

    const total = await this.prisma.equipment.count({ where });

    return {
      data: equipments,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        filters: { name, ean, alocatedAtId, status, search },
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

    const updateData: any = {};

    if (dto.name) updateData.name = normalizeString(dto.name);
    if (dto.ean) updateData.ean = normalizeString(dto.ean);
    
    // Verificação de Departamento
    if (dto.alocatedAtId) {
      const department = await this.prisma.department.findUnique({
        where: { id: dto.alocatedAtId },
      });
      if (!department) throw new HttpException(`Department '${dto.alocatedAtId}' not found`, HttpStatus.BAD_REQUEST);
      updateData.alocatedAtId = dto.alocatedAtId;
    }

    // Remover campos que não devem ser atualizados diretamente aqui
    delete (updateData as any).createdAt;
    delete (updateData as any).disabledAt;
    
    if ((dto as any).status) {
       const newStatus = this.mapToPrismaStatus((dto as any).status);
       if (newStatus) updateData.status = newStatus;
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedEquipment = await tx.equipment.update({
        where: { id },
        data: updateData,
      });

      // Registrar movimentação se o departamento foi alterado
      if (updateData.alocatedAtId && updateData.alocatedAtId !== existing.alocatedAtId) {
        await tx.equipmentMove.create({
          data: {
            equipmentId: id,
            previouslyAlocatedAtId: existing.alocatedAtId,
            newlyAlocatedAtId: updateData.alocatedAtId,
            createdAt: new Date(),
          }
        });
      }

      return updatedEquipment;
    });
  }

  async setStatus(id: string, status: EquipmentStatus) {
    const equipment = await this.prisma.equipment.findUnique({ where: { id } });
    if (!equipment) throw new HttpException('Equipment not found', HttpStatus.NOT_FOUND);

    const data: any = {};
    const prismaStatus = this.mapToPrismaStatus(status);
    
    if (!prismaStatus) throw new HttpException('Invalid status', HttpStatus.BAD_REQUEST);

    if (prismaStatus === EquipmentStatus.DESABILITADO) {
      if (equipment.status === EquipmentStatus.DESABILITADO) {
         throw new HttpException('Equipment already disabled', HttpStatus.BAD_REQUEST);
      }
      data.disabledAt = new Date();
      data.disabled = true; // Sync legacy
    } else {
      data.disabledAt = null;
      data.disabled = false; // Sync legacy
    }

    data.status = prismaStatus;

    return this.prisma.equipment.update({ where: { id }, data });
  }

  async softRemove(id: string) {
    return this.setStatus(id, EquipmentStatus.DESABILITADO);
  }
}