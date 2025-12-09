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

    const recentMaintenances = await this.prisma.maintenance.findMany({
      where: {
        equipmentId: dto.equipmentId,
        createdAt: { gte: threeMonthsAgo },
      },
      take: 1,
    });

    if (recentMaintenances.length) {
      const alertDto: CreateAlertDto = {
        severity: AlertSeverity.HIGH,
        description: `O equipamento ${equipment.name} do setor ${equipment.alocatedAt?.name ?? 'desconhecido'} possui manutenções frequentes realizadas`,
      };

      try {
        await this.alertsService.create(alertDto as any);
      } catch (err) {
          console.error('Failed to create alert', err)
      }
    }
    
    const departmentId = equipment.alocatedAt?.id;
    if (departmentId) {
      const deptMaintCount = await this.prisma.maintenance.count({
        where: {
          createdAt: { gte: threeMonthsAgo },
          equipment: { alocatedAtId: departmentId },
        },
      });

      if (deptMaintCount > 3) {
        const deptAlertDto: CreateAlertDto = {
          severity: AlertSeverity.MEDIUM,
          description: `Departamento ${equipment.alocatedAt?.name ?? 'desconhecido'} possui manutenções frequentes nos últimos meses`,
        };

        try {
          await this.alertsService.create(deptAlertDto as any);
        } catch (err) {
          console.error('Failed to create department alert', err);
        }
      }
    }
    
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


    const maintenance = await this.prisma.maintenance.create({
      data: {
        technician: dto.technician,
        contact: dto.contact,
        description: dto.description,
        status: MaintenanceStatus.ABERTA,
        equipmentId: dto.equipmentId,
      },
    });

    // Atualiza o status do equipamento para EM_MANUTENCAO
    try {
      await this.prisma.equipment.update({
        where: { id: dto.equipmentId },
        data: { status: EquipmentStatus.EM_MANUTENCAO },
      });
    } catch (err) {
      // Não impedir criação da manutenção se atualização do equipamento falhar
      console.error('Failed to update equipment status to EM_MANUTENCAO', err);
    }

    if (dto.componentIds?.length) {
      await this.prisma.maintenanceComponent.createMany({
        data: dto.componentIds.map(componentId => ({
          maintenanceId: maintenance.id,
          componentId,
        })),
      });
    } 

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

     return this.prisma.maintenance.update({
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
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.prisma.maintenanceComponent.deleteMany({
      where: { maintenanceId: id },
    });

    return this.prisma.maintenance.delete({ where: { id } });
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
}
