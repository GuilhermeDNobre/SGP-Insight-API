import { useState, useCallback } from 'react'
import api from '../services/api'
import { AlertFilters } from '@renderer/components/AlertModal'

export interface Alert {
  id: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
  description: string
  trimestre: number
  occurrenceCount: number
  lastRecurrenceAt: string
  createdAt: string
  equipment?: { 
    name: string;
    alocatedAt?: { name: string } | null
  } | null
  component?: { name: string } | null
}

interface UseAlertsReturn {
  alerts: Alert[]
  isLoading: boolean
  page: number
  totalPages: number
  totalItems: number
  changePage: (page: number) => void
  loadAlerts: (page?: number, search?: string, filters?: AlertFilters) => Promise<void>
}

export function useAlerts(): UseAlertsReturn  {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Paginação
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const loadAlerts = useCallback(async (
    pageToLoad: number = 1, 
    search: string = '',
    filters: AlertFilters = {}
  ) => {
    setIsLoading(true)
    try {
      const params = {
        page: pageToLoad,
        limit: 9, // Ajuste para caber bem na tela (ex: 3x3 cards)
        search: search || undefined,
        quarter: filters.trimestre || undefined,
        occurrenceCount: filters.occurrenceCount || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      }

      const response = await api.get('/alerts', { params })
      
      setAlerts(response.data.data)
      setTotalPages(response.data.meta.lastPage)
      setTotalItems(response.data.meta.total)
      setPage(response.data.meta.page)
    } catch (error) {
      console.error('Erro ao carregar alertas', error)
      setAlerts([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const changePage = (p: number): void => {
    setPage(p) 
  }

  return {
    alerts,
    isLoading,
    page,
    totalPages,
    totalItems,
    changePage,
    loadAlerts
  }
}