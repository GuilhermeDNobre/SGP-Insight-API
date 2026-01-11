import { useState, useCallback } from 'react'
import api from '../services/api'
import { Maintenance, CreateMaintenanceInput, UpdateMaintenanceInput } from '../types/maintenance'
import { MaintenanceFilterValues } from '@renderer/components/MaintenanceFilterModal'

export function useMaintenance(): {
  maintenances: Maintenance[], 
  maintenance: Maintenance | null, 
  isLoading: boolean, 
  page: number, 
  totalPages: number, 
  changePage: (page: number) => Promise<void>,
  loadMaintenances: (page: number, search?: string, filters?: MaintenanceFilterValues) => Promise<void>,
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

  const loadMaintenances = useCallback(async (
    pageToLoad: number = 1, 
    search: string = '', 
    filters: MaintenanceFilterValues = {}
  ) => {
    try {
      setIsLoading(true)

      const params = {
        page: pageToLoad,
        limit: 10,
        search: search || undefined,
        status: filters.status || undefined,
        openDate: filters.openDate || undefined,
        closeDate: filters.closeDate || undefined
      }

      const response = await api.get('/maintenance', { params })
      
      setMaintenances(response.data.data)
      if (response.data.meta) {
        setTotalPages(response.data.meta.lastPage)
        setTotalItems(response.data.meta.total)
        setPage(response.data.meta.page)
      }
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

  const finishMaintenance = async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      await api.patch(`/maintenance/${id}/finish`) 
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMaintenance = async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      await api.delete(`/maintenance/${id}`)
      setMaintenances(prev => prev.filter(m => m.id !== id))
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
    changePage: (p) => loadMaintenances(p),
    loadMaintenances,
    loadMaintenanceById,
    createMaintenance,
    updateMaintenance,
    finishMaintenance,
    deleteMaintenance
  }
}