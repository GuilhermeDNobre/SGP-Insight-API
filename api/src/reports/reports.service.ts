import { Injectable } from '@nestjs/common';
import { DepartmentService } from '../department/department.service';
import { EquipmentService } from '../equipment/equipment.service';
import { MaintenanceService } from '../maintenance/maintenance.service';
import * as fs from 'fs';
import * as path from 'path';

const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');

pdfMake.vfs = pdfFonts.vfs;

@Injectable()
export class ReportsService {
  constructor(
    private departmentService: DepartmentService,
    private equipmentService: EquipmentService,
    private maintenanceService: MaintenanceService,
  ) {}

  async generateReport(): Promise<string> {

    // Gather data
    const deptCount = await this.departmentService.countDepartments();
    const deptsWithCount = await this.departmentService.listDepartmentsWithEquipmentCount();
    const totalEquipments = await this.equipmentService.countTotalEquipments();
    const equipmentStatusCounts = await this.equipmentService.countEquipmentStatus();
    const totalMaintenances = await this.maintenanceService.countTotalMaintenances();
    const maintenanceStatusCounts = await this.maintenanceService.countMaintenancesByStatus();

    // Current date
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const formattedDate = now.toLocaleDateString('pt-BR');

    // PDF content
    const docDefinition = {
      content: [
        { text: 'Relatório Patrimonial SGP Insight', style: 'header' },
        { text: `Esse é um relatório geral criado a partir dos dados do sistema referentes a data ${formattedDate}.`, style: 'subheader' },
        { text: '', margin: [0, 20] },
        { text: 'Seção Departamentos', style: 'sectionHeader' },
        { text: `Quantidade de departamentos cadastrados: ${deptCount}`, style: 'text' },
        {
          ul: deptsWithCount.map(dept => `${dept.name}: ${dept.equipmentCount} equipamentos`),
        },
        { text: '', margin: [0, 20] },
        { text: 'Seção de Equipamentos', style: 'sectionHeader' },
        { text: `Quantidade de equipamentos cadastrados no sistema: ${totalEquipments}`, style: 'text' },
        {
          ul: [
            `Disponíveis (Ativos): ${equipmentStatusCounts.ATIVO}`,
            `Em Manutenção: ${equipmentStatusCounts.EM_MANUTENCAO}`,
            `Desabilitados: ${equipmentStatusCounts.DESABILITADO}`,
          ],
        },
        { text: '', margin: [0, 20] },
        { text: 'Seção de Manutenção', style: 'sectionHeader' },
        { text: `Quantidade de manutenções: ${totalMaintenances}`, style: 'text' },
        {
          ul: [
            `Em andamento: ${maintenanceStatusCounts.EM_ANDAMENTO}`,
            `Finalizadas: ${maintenanceStatusCounts.TERMINADA}`,
          ],
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
        },
        subheader: {
          fontSize: 14,
          italics: true,
          alignment: 'center',
        },
        sectionHeader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        text: {
          fontSize: 12,
        },
      },
    };

    // Create PDF
    const pdfDoc = pdfMake.createPdf(docDefinition);

    // Folder path
    const folderPath = path.join(process.env.PUBLIC || 'C:\\Users\\Public\\Documents', 'relatórios-SGP');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // File path
    const fileName = `Relatório-SGP-${dateStr}.pdf`;
    const filePath = path.join(folderPath, fileName);

    // Save PDF
    return new Promise<string>((resolve, reject) => {
      pdfDoc.getBuffer((buffer: Buffer) => {
        fs.writeFile(filePath, buffer, (err) => {
          if (err) reject(err);
          else resolve(filePath);
        });
      });
    });
  }
}
