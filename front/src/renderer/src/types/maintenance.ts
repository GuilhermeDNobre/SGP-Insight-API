export type MaintenanceStatus = 'ABERTA' | 'EM_ANDAMENTO' | 'TERMINADA'

export interface Maintenance {
  id: string
  technician: string // Responsável
  description: string
  status: MaintenanceStatus
  createdAt: string
  finishedAt?: string | null
  
  // Relacionamentos para exibição
  equipmentId: string
  equipment?: {
    id: string
    name: string
    ean: string
  }

  // Componentes envolvidos na manutenção
  components?: {
    component: {
      id: string
      name: string
      // Lembrando que no front usamos 'model' visualmente, mas o back manda 'name'
    }
  }[]
}

export interface CreateMaintenanceInput {
  equipmentId: string
  technician: string
  description: string
  componentIds: string[] // IDs dos componentes selecionados
}

export interface UpdateMaintenanceInput {
  technician?: string
  description?: string
  status?: MaintenanceStatus
  finishedAt?: Date // Usado ao finalizar
}