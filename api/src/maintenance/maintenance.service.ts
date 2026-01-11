import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { MaintenanceStatus, UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MaintenanceFiltersDto } from './dto/maintenance-filters.dto';
import { AlertsService } from 'src/alerts/alerts.service';
import { CreateAlertDto, AlertSeverity } from 'src/alerts/dto/create-alert.dto';
import { EquipmentStatus } from '@prisma/client';
import { take } from 'rxjs';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService, private alertsService: AlertsService) {} 


  async create(dto: CreateMaintenanceDto) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id: dto.equipmentId },
      include: { components: true, alocatedAt: true },
    });

    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }
    
    // verifica se já houve manutenção para este equipamento nos últimos 3 meses
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    if (dto.componentIds?.length) {
      const equipmentComponents = await this.prisma.component.findMany({
        where: { equipmentId: dto.equipmentId },
      });

      const equipmentComponentIds = equipmentComponents.map(c => c.id);

      const invalid = dto.componentIds.filter(id => !equipmentComponentIds.includes(id));

      if (invalid.length) {
        throw new BadRequestException('Some components do not belong to this equipment');
      }
    }

    const maintenance = await this.prisma.$transaction(async (tx) => {
      // 3.1 Cria a manutenção
      const newMaintenance = await tx.maintenance.create({
        data: {
          technician: dto.technician,
          contact: dto.contact,
          description: dto.description,
          status: MaintenanceStatus.ABERTA,
          equipmentId: dto.equipmentId,
        },
      });

      // 3.2 Vincula componentes
      if (dto.componentIds?.length) {
        await tx.maintenanceComponent.createMany({
          data: dto.componentIds.map(componentId => ({
            maintenanceId: newMaintenance.id,
            componentId,
          })),
        });
      } 

      // 3.3 Atualiza status do equipamento
      await tx.equipment.update({
        where: { id: dto.equipmentId },
        data: { status: EquipmentStatus.EM_MANUTENCAO },
      });

      return newMaintenance;
    });

    // 4. Gatilho de Alertas
    this.alertsService.checkAndGenerateAlert(maintenance.equipmentId)
      .catch(err => console.error('[ALERTS] Falha ao verificar recorrência:', err));

    // Retorna a manutenção criada
    return this.prisma.maintenance.findUnique({
        where: { id: maintenance.id },
        include: { components: { include: { component: true } } },
    });
  }

  async findAll(query: MaintenanceFiltersDto) {
    const page = query.page ?? 1
    const take = query.limit ?? 10
    const skip = (page-1) *take

    const where: any = {
      equipmentId: query.equipmentId,
      status: query.status,
      resolved: query.onlyOpen ? false : undefined,
    }

    if (query.search) {
      where.OR = [
        { technician: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { equipment: { name: { contains: query.search, mode: 'insensitive' } } }
      ];
    }

    // Função auxiliar que calcula o intervalo completo do dia, 
    // permitindo que o Node.js calcule o Fuso Horário da API (que é geralmente UTC)
    const getCompensatedRange = (dateStr: string) => {
      const start = new Date(dateStr); 
      start.setUTCHours(3, 0, 0, 0); 

      const end = new Date(dateStr);
      end.setDate(end.getDate() + 1); // Avança um dia
      end.setUTCHours(3, 0, 0, 0); // Define para 03:00:00 UTC do dia seguinte (que é 00:00 BRT do dia seguinte)

      console.log(`[DEBUG DATE - BRASIL GMT-3] Buscando range para ${dateStr}:`);
      // Deve mostrar algo como "Mon Dec 09 2025 00:00:00 GMT+0000 (Coordinated Universal Time)"
      console.log(` > De: ${start.toISOString()}`); // Deve ser 2025-12-09T00:00:00.000Z
      console.log(` > Até: ${end.toISOString()}`);   // Deve ser 2025-12-10T00:00:00.000Z

      return {
        gte: start,
        lt: end
      };
    };

    if (query.openDate) {
      where.createdAt = getCompensatedRange(query.openDate);
    }

    if (query.closeDate) {
      where.finishedAt = getCompensatedRange(query.closeDate);
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.maintenance.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { 
          equipment: {
            select: {
              id: true,
              name: true,
              ean: true
            }
          },
          components: { include: { component: true } }
        },
      }),
      this.prisma.maintenance.count({ where }),
    ]);

    console.log('Where Clause Final:', JSON.stringify(where, null, 2));
    return {
      data: items,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / take),
      },
    };

  }

  async findOne(id: string) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id },
      include: { 
        equipment: { select: { id: true, name: true, ean: true } },
        components: { include: { component: true } } 
      },
    });

    if (!maintenance) {
      throw new NotFoundException('Maintenance not found');
    }

    return maintenance;
  }

  async update(id: string, dto: UpdateMaintenanceDto) {
     await this.findOne(id)

     return this.prisma.$transaction(async (tx) => {
        // 1. Atualiza a manutenção
        const updatedMaintenance = await tx.maintenance.update({
          where: { id },
          data: { 
            technician: dto.technician,
            contact: dto.contact,
            description: dto.description,
            status: dto.status ?? undefined,
            finishedAt: dto.status === MaintenanceStatus.TERMINADA ? new Date() : undefined, 
          },
          include: { 
            equipment: { select: { id: true, name: true, ean: true } },
            components: { include: { component: true } } 
          },
        });

        // 2. Se o status mudou para TERMINADA, libera o equipamento
        if (dto.status === MaintenanceStatus.TERMINADA) {
           await tx.equipment.update({
             where: { id: updatedMaintenance.equipmentId },
             data: { status: EquipmentStatus.ATIVO }
           });
        }

        return updatedMaintenance;
     });
  }

  async remove(id: string) {
    const maintenance = await this.findOne(id);

    return this.prisma.$transaction(async (tx) => {
      // 1. Remove vínculos de componentes
      await tx.maintenanceComponent.deleteMany({
        where: { maintenanceId: id },
      });

      // 2. Remove a manutenção
      const deleted = await tx.maintenance.delete({ where: { id } });

      // 3. Se a manutenção removida NÃO estava terminada (ou seja, estava ativa), libera o equipamento
      if (maintenance.status !== MaintenanceStatus.TERMINADA) {
        await tx.equipment.update({
          where: { id: maintenance.equipmentId },
          data: { status: EquipmentStatus.ATIVO }
        });
      }

      return deleted;
    });
  }

  //marca como em andamento
  async markAsWorking(id: string) {
    return this.prisma.maintenance.update({
      where: { id },
      data: { status: 'EM_ANDAMENTO'},
    });
  }
  
  //marca como completa
  async markAsCompleted(id: string) {
    return this.prisma.maintenance.update({
      where: { id },
      data: { status: 'TERMINADA'},
    });
  }

  async countTotalMaintenances(): Promise<number> {
    return await this.prisma.maintenance.count();
  }

  async countMaintenancesByStatus(): Promise<Record<string, number>> {
    const groups: any[] = await this.prisma.maintenance.groupBy({
      by: ['status'],
      _count: { _all: true },
    } as any);

    const counts: Record<string, number> = {
      ABERTA: 0,
      EM_ANDAMENTO: 0,
      TERMINADA: 0,
    };

    for (const g of groups) {
      const status = String(g.status).toUpperCase();
      counts[status] = g._count?._all ?? 0;
    }

    return counts;
  }
}
