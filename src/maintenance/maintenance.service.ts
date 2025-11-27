import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { MaintenanceStatus, UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MaintenanceFiltersDto } from './dto/maintenance-filters.dto';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {} 


  async create(dto: CreateMaintenanceDto) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id: dto.equipmentId },
      include: { components: true },
    });

    if (!equipment) {
      throw new NotFoundException('Equipment not found');
    }
    
    //verifica se componente é do equipamento (tab tab)
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

  //falta paginar, faço isso depois
  async findAll(query: MaintenanceFiltersDto) {
    return `This action returns all maintenance`;
  }

  async findOne(id: string) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id },
      include: { components: { include: { component: true } } },
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
      include: { components: { include: { component: true } } },
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
