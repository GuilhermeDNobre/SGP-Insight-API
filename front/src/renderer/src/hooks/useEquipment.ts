import { useCallback, useState } from 'react'
import api from '../services/api'
import { ComponentData, EquipmentStatus } from '../types/equipment';

export interface EquipmentData {
  id: string
  name: string
  ean: string
  status: string
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
  components?: ComponentData[] 
}

export interface UpdateEquipmentInput {
  name?: string
  ean?: string
  alocatedAtId?: string
  status?: EquipmentStatus
}

interface FormErrors {
  name?: string
  ean?: string
  alocatedAtId?: string
}

interface EquipmentFilters {
  departmentId?: string
  status?: string // Agora aceita string (ex: "ATIVO,EM_MANUTENCAO")
}
interface UseEquipmentReturn {
  equipments: EquipmentData[]
  equipment: EquipmentData | null
  isLoading: boolean
  errors: FormErrors
  setErrors: (errors: FormErrors) => void
  loadEquipments: (
    page?: number,
    search?: string,
    filters?: EquipmentFilters
  ) => Promise<void>
  loadEquipmentById: (id: string) => Promise<void>
  createEquipment: (data: CreateEquipmentInput) => Promise<EquipmentData>
  updateEquipment: (id: string, data: UpdateEquipmentInput) => Promise<void>
  deleteEquipment: (id: string) => Promise<void>
  page: number
  totalPages: number
  totalItems: number
  changePage: (page: number) => void
}

export function useEquipment(): UseEquipmentReturn {
  const [equipments, setEquipments] = useState<EquipmentData[]>([])
  const [equipment, setEquipment] = useState<EquipmentData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadEquipments = useCallback(async (
    pageToLoad:  number = 1,
    search : string = '',
    filters : EquipmentFilters = {}
  ): Promise<void> => {
    try {
      setIsLoading(true)

      const params = {
        page: pageToLoad,
        limit: 10,
        search: search || undefined,
        alocatedAtId: filters.departmentId || undefined,
        status: filters.status || undefined // Passa a string direta para o back
      }

      const response = await api.get('/equipment', { params });

      const data = response.data?.data && Array.isArray(response.data.data) ? response.data.data : []
      const meta = response.data?.meta
      
      setEquipments(data)

      if (meta) {
        setPage(meta.page)
        setTotalPages(meta.lastPage)
        setTotalItems(meta.total)
      }
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

  const createEquipment = async (data: CreateEquipmentInput): Promise<EquipmentData> => {
    if (!validateForm(data)) {
      throw new Error('Formulário inválido')
    }

    try {
      setIsLoading(true)
      const response = await api.post('/equipment', data)

      setEquipments((prev) => [...prev, response.data])

      await loadEquipments(page)
      console.log('[useEquipment] Equipamento criado:', response.data)
      return response.data
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
    deleteEquipment,
    page,
    totalPages,
    totalItems,
    changePage: (newPage) => loadEquipments(newPage)
  }
}
