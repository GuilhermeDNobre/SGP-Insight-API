import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async checkAndGenerateAlert(equipmentId: string, componentId: string | null = null) {
    const now = new Date();
    const currentMonth = now.getMonth(); 
    const currentQuarter = Math.floor(currentMonth / 3) + 1; // 1, 2, 3 ou 4
    const currentYear = now.getFullYear();

    // Define intervalo do trimestre
    const startOfQuarter = new Date(currentYear, (currentQuarter - 1) * 3, 1);
    const endOfQuarter = new Date(currentYear, currentQuarter * 3, 0, 23, 59, 59);

    // 1. Conta manutenções neste trimestre
    const maintenanceCount = await this.prisma.maintenance.count({
      where: {
        equipmentId: equipmentId,
        createdAt: { gte: startOfQuarter, lte: endOfQuarter },
        // ...(componentId ? { components: { some: { componentId } } } : {})
      },
    });

    // Se for a 2ª ou mais, gera alerta
    if (maintenanceCount >= 2) {
      // Verifica se já existe alerta para não duplicar
      const existingAlert = await this.prisma.alerts.findFirst({
        where: {
          equipmentId,
          componentId: componentId || null,
          trimestre: currentQuarter,
          createdAt: { gte: new Date(currentYear, 0, 1) } // Mesmo ano
        }
      });

      if (existingAlert) {
        // Atualiza recorrência (+1)
        await this.prisma.alerts.update({
          where: { id: existingAlert.id },
          data: { 
            occurrenceCount: maintenanceCount,
            lastRecurrenceAt: now, 
            description: `Recorrência detectada: ${maintenanceCount} manutenções no ${currentQuarter}º Trimestre`
          }
        });
      } else {
        // Cria novo alerta
        const equipment = await this.prisma.equipment.findUnique({ where: { id: equipmentId } });
        
        await this.prisma.alerts.create({
          data: {
            severity: 'MEDIUM',
            description: `Recorrência detectada: ${maintenanceCount} manutenções no ${currentQuarter}º Trimestre`,
            equipmentId,
            trimestre: currentQuarter,
            occurrenceCount: maintenanceCount,
            lastRecurrenceAt: now
          }
        });
      }
    }
  }

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

  async findAll(
    page: number = 1, 
    limit: number = 10, 
    search?: string, 
    trimestre?: number,
    occurrenceCount?: number,
    startDate?: string, 
    endDate?: string) {
    console.log('--- DEBUG FILTROS ALERTAS ---');
    console.log('Recebido Quarter:', trimestre, typeof trimestre);
    console.log('Recebido Occurrence:', occurrenceCount, typeof occurrenceCount);
    console.log('Recebido Dates:', startDate, endDate);

    const skip = (page - 1) * limit;

    const where: any = {};

    if (trimestre) where.trimestre = trimestre;

    if (occurrenceCount) {
      where.occurrenceCount = { gte: occurrenceCount };
    }

    if (startDate || endDate) {
      where.lastRecurrenceAt = {};
      if (startDate) {
        // Início do dia
        where.lastRecurrenceAt.gte = new Date(`${startDate}T00:00:00.000Z`);
      }
        
      if (endDate) {
        // Final do dia
        where.lastRecurrenceAt.lte = new Date(`${endDate}T23:59:59.999Z`);
      }
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { equipment: { name: { contains: search, mode: 'insensitive' } } },
        { component: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    console.log('Where Clause:', JSON.stringify(where, null, 2));
    const [alerts, total] = await Promise.all([
      this.prisma.alerts.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastRecurrenceAt: 'desc' }, // Mais recentes primeiro
        include: {
          equipment: { 
            select: { 
              name: true,
              alocatedAt: { select: { name: true } }
            }
          }, // Traz o nome do equipamento
          component: { select: { name: true } }, // Traz o nome do componente
        },
      }),
      this.prisma.alerts.count({ where }),
    ]);

    return {
      data: alerts,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.alerts.findUnique({ where: { id } });
  }
}
