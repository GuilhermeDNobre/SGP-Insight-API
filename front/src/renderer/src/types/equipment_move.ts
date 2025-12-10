export interface EquipmentMove {
  id: string
  createdAt: string
  equipment: {
    id: string
    name: string
    ean: string
  }
  previouslyAlocatedAt: {
    id: string
    name: string
  } | null // Pode ser null se for a primeira alocação (criação)
  newlyAlocatedAt: {
    id: string
    name: string
  }
}