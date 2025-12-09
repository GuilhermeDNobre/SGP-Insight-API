import { useState, useCallback } from 'react'
import api from '../services/api'
import { Maintenance, CreateMaintenanceInput, UpdateMaintenanceInput } from '../types/maintenance'

/*interface MaintenanceFilters {
  page?: number
  limit?: number
  search?: string // Pode buscar por técnico ou equipamento
  status?: string
}*/

export function useMaintenance(): {
  maintenances: Maintenance[], 
  maintenance: Maintenance | null, 
  isLoading: boolean, 
  page: number, 
  totalPages: number, 
  changePage: (page: number, search: string, status: string) => Promise<void>,
  loadMaintenances: (page: number, search?: string, status?: string) => Promise<void>,
  loadMaintenanceById: (id: string) => Promise<void>,
  createMaintenance: (data: CreateMaintenanceInput) => Promise<void>,
  updateMaintenance: (id: string, data: UpdateMaintenanceInput) => Promise<void>,
  finishMaintenance: (id: string) => Promise<void>,
  deleteMaintenance: (id: string) => Promise<void>
} {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // Paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ , setTotalItems] = useState(0);

  const loadMaintenances = useCallback(async (pageToLoad = 1, search = '', status = '') => {
    try {
      setIsLoading(true)
      let url = `/maintenance?page=${pageToLoad}&limit=10`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (status) url += `&status=${status}`

      const response = await api.get(url)
      
      setMaintenances(response.data.data)
      setTotalPages(response.data.meta.lastPage)
      setTotalItems(response.data.meta.total)
      setPage(response.data.meta.page)
    } catch (error) {
      console.error('Erro ao carregar manutenções', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadMaintenanceById = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      const response = await api.get(`/maintenance/${id}`)
      setMaintenance(response.data)
    } catch (error) {
      console.error('Erro ao carregar manutenção', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createMaintenance = async (data: CreateMaintenanceInput): Promise<void> => {
    try {
      setIsLoading(true)
      await api.post('/maintenance', data)
    } finally {
      setIsLoading(false)
    }
  }

  const updateMaintenance = async (id: string, data: UpdateMaintenanceInput): Promise<void> => {
    try {
      setIsLoading(true)
      await api.patch(`/maintenance/${id}`, data)
    } finally {
      setIsLoading(false)
    }
  }

  // Ação Especial: Finalizar
  const finishMaintenance = async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      // Geralmente há uma rota específica ou um patch com status TERMINADA
      await api.patch(`/maintenance/${id}/finish`) 
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMaintenance = async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      await api.delete(`/maintenance/${id}`)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    maintenances,
    maintenance,
    isLoading,
    page,
    totalPages,
    changePage: loadMaintenances, // Alias
    loadMaintenances,
    loadMaintenanceById,
    createMaintenance,
    updateMaintenance,
    finishMaintenance,
    deleteMaintenance
  }
}