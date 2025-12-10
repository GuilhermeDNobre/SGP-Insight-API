export type EquipmentStatus = 'ATIVO' | 'EM_MANUTENCAO' | 'DESABILITADO'

export interface ComponentData {
  id: string;
  type: string; // Ex: "Processador"
  model: string; // Ex: "Intel Core i7-12700K"
}

export interface EquipmentData {
  id: string
  name: string
  ean: string
  alocatedAtId: string
  status: EquipmentStatus 
  disabled: boolean
  createdAt: string
  alocatedAt?: {
    id: string
    name: string
  }
  components: ComponentData[];
  equipmentCount?: number;
}