import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async create(createAlertDto: CreateAlertDto) {
    const data: any = {
      severity: createAlertDto.severity,
      description: createAlertDto.description,
      equipmentId: createAlertDto.equipmentId ?? undefined,
      componentId: createAlertDto.componentId ?? undefined,
      maintenanceId: createAlertDto.maintenanceId ?? undefined,
      trimestre: createAlertDto.trimestre ?? undefined,
      lastRecurrenceAt: createAlertDto.lastRecurrenceAt ? new Date(createAlertDto.lastRecurrenceAt) : undefined,
      occurrenceCount: createAlertDto.occurrenceCount ?? 0,
    };

    return this.prisma.alerts.create({ data });
  }

  async findAll() {
    return this.prisma.alerts.findMany();
  }

  async findOne(id: string) {
    return this.prisma.alerts.findUnique({ where: { id } });
  }
}
