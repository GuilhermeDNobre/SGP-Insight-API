import { useState, useCallback } from 'react'
import api from '../services/api'
import { EquipmentMove } from '../types/equipment_move'

interface MoveFilters {
  page?: number
  limit?: number
  equipmentId?: string
  previouslyAlocatedAtId?: string
  newlyAlocatedAtId?: string
  orderBy?: string
  sort?: 'asc' | 'desc'
}

interface UseEquipmentMoveReturn {
  movements: EquipmentMove[]
  isLoading: boolean
  totalMoves: number
  loadMovements: (filters: MoveFilters) => Promise<void>
}
export function useEquipmentMove(): UseEquipmentMoveReturn {
  const [movements, setMovements] = useState<EquipmentMove[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [totalMoves, setTotalMoves] = useState(0)

  const loadMovements = useCallback(async (filters: MoveFilters) => {
    try {
      setIsLoading(true)
      
      const params = new URLSearchParams()
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.equipmentId) params.append('equipmentId', filters.equipmentId)
      if (filters.previouslyAlocatedAtId) params.append('previouslyAlocatedAtId', filters.previouslyAlocatedAtId)
      if (filters.newlyAlocatedAtId) params.append('newlyAlocatedAtId', filters.newlyAlocatedAtId)
      if (filters.orderBy) params.append('orderBy', filters.orderBy)
      if (filters.sort) params.append('sort', filters.sort)


      const response = await api.get(`/equipment-move?${params.toString()}`)
      
      setMovements(response.data.data)
      setTotalMoves(response.data.meta.total)
    } catch (error) {
      console.error('Erro ao carregar movimentações', error)
      setMovements([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    movements,
    isLoading,
    totalMoves,
    loadMovements
  }
}