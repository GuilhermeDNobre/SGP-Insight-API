export interface ComponentData {
  id: string;
  type: string; // Ex: "Processador"
  model: string; // Ex: "Intel Core i7-12700K"
}

export interface EquipmentData {
  id: string; // UUID
  displayId: string; // ID amigável (AN0000001)
  name: string;
  status: 'ativo' | 'disponivel' | 'manutencao' | 'indisponivel';
  location: string; // Nome do departamento (Setor X)
  components: ComponentData[];
  equipmentCount?: number;
}