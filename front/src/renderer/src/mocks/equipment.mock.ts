import { EquipmentData } from '../types/equipment';

export const MOCKED_EQUIPMENT_LIST: EquipmentData[] = [
  {
    id: 'a1b2c3d4',
    displayId: 'AN0000001',
    name: 'Equipamento X',
    status: 'ativo',
    location: 'Setor X',
    components: [
      { id: 'c1', type: 'Processador', name: 'Intel Core i7-12700K' },
      { id: 'c2', type: 'Placa de Vídeo', name: 'NVIDIA RTX 4070' },
    ],
  },
  {
    id: 'e5f6g7h8',
    displayId: 'DS0000002',
    name: 'Servidor Principal',
    status: 'manutencao',
    location: 'Data Center',
    components: [
      { id: 'c3', type: 'Processador', name: 'AMD EPYC 7763' },
      { id: 'c4', type: 'Memória RAM', name: '128GB DDR4 ECC' },
    ],
  },
  {
    id: 'i9j0k1l2',
    displayId: 'AN0000003',
    name: 'Notebook Vendedor',
    status: 'indisponivel',
    location: 'Armário 3',
    components: [
      { id: 'c5', type: 'Processador', name: 'Intel Core i5-1135G7' },
      { id: 'c6', type: 'Armazenamento (SSD)', name: 'Samsung 512GB NVMe' },
    ],
  },
];