import { useCallback, useState } from 'react'
import api from '../services/api'

export interface EquipmentData {
  id: string
  name: string
  ean: string
  disabled: boolean
  createdAt: string
  disabledAt?: string | null
  alocatedAtId: string
  alocatedAt?: {
    id: string
    name: string
    location: string
    responsableName: string
    responsableEmail: string
  }
}

export interface CreateEquipmentInput {
  name: string
  ean: string
  alocatedAtId: string
}

export interface UpdateEquipmentInput {
  name?: string
  ean?: string
  alocatedAtId?: string
  disabled?: boolean
}

interface FormErrors {
  name?: string
  ean?: string
  alocatedAtId?: string
}

interface UseEquipmentReturn {
  equipments: EquipmentData[]
  equipment: EquipmentData | null
  isLoading: boolean
  errors: FormErrors
  setErrors: (errors: FormErrors) => void
  loadEquipments: () => Promise<void>
  loadEquipmentById: (id: string) => Promise<void>
  createEquipment: (data: CreateEquipmentInput) => Promise<void>
  updateEquipment: (id: string, data: UpdateEquipmentInput) => Promise<void>
  deleteEquipment: (id: string) => Promise<void>
}

export function useEquipment(): UseEquipmentReturn {
  const [equipments, setEquipments] = useState<EquipmentData[]>([])
  const [equipment, setEquipment] = useState<EquipmentData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const loadEquipments = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await api.get('/equipment')
      // API returns paginated response: { data: [...], meta: {...} }
      const data =
        response.data?.data && Array.isArray(response.data.data) ? response.data.data : []
      setEquipments(data)
    } catch (error) {
      console.error('[useEquipment] Erro ao carregar equipamentos:', error)
      setEquipments([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadEquipmentById = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await api.get(`/equipment/${id}`)
      setEquipment(response.data || null)
    } catch (error) {
      console.error('[useEquipment] Erro ao carregar equipamento:', error)
      setEquipment(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const validateForm = (data: CreateEquipmentInput | UpdateEquipmentInput): boolean => {
    const newErrors: FormErrors = {}

    if ('name' in data && !data.name?.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if ('ean' in data && !data.ean?.trim()) {
      newErrors.ean = 'EAN é obrigatório'
    } else if ('ean' in data && data.ean && !/^\d+$/.test(data.ean)) {
      newErrors.ean = 'EAN deve conter apenas números'
    }

    if ('alocatedAtId' in data && !data.alocatedAtId?.trim()) {
      newErrors.alocatedAtId = 'Departamento é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const createEquipment = async (data: CreateEquipmentInput): Promise<void> => {
    if (!validateForm(data)) {
      throw new Error('Formulário inválido')
    }

    try {
      setIsLoading(true)
      const response = await api.post('/equipment', data)
      setEquipments((prev) => [...prev, response.data])
      console.log('[useEquipment] Equipamento criado:', response.data)
    } catch (error) {
      console.error('[useEquipment] Erro ao criar equipamento:', error)
      throw error instanceof Error ? error : new Error('Erro ao criar equipamento')
    } finally {
      setIsLoading(false)
    }
  }

  const updateEquipment = async (id: string, data: UpdateEquipmentInput): Promise<void> => {
    if (!validateForm(data as CreateEquipmentInput)) {
      throw new Error('Formulário inválido')
    }

    try {
      setIsLoading(true)
      const response = await api.patch(`/equipment/${id}`, data)
      setEquipments((prev) => prev.map((eq) => (eq.id === id ? response.data : eq)))
      setEquipment(response.data)
      console.log('[useEquipment] Equipamento atualizado:', response.data)
    } catch (error) {
      console.error('[useEquipment] Erro ao atualizar equipamento:', error)
      throw error instanceof Error ? error : new Error('Erro ao atualizar equipamento')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteEquipment = async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      await api.delete(`/equipment/${id}`)
      setEquipments((prev) => prev.filter((eq) => eq.id !== id))
      console.log('[useEquipment] Equipamento deletado:', id)
    } catch (error) {
      console.error('[useEquipment] Erro ao deletar equipamento:', error)
      throw error instanceof Error ? error : new Error('Erro ao deletar equipamento')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    equipments,
    equipment,
    isLoading,
    errors,
    setErrors,
    loadEquipments,
    loadEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
  }
}
