import { useCallback, useState } from 'react'
import api from '../services/api'

export interface DepartmentData {
  id: string
  name: string
  location: string
  responsableName: string
  responsableEmail: string
}

export interface CreateDepartmentInput {
  name: string
  location: string
  responsableName: string
  responsableEmail: string
}

export interface UpdateDepartmentInput {
  name?: string
  location?: string
  responsableName?: string
  responsableEmail?: string
}

interface FormErrors {
  name?: string
  location?: string
  responsableName?: string
  responsableEmail?: string
}

interface UseDepartmentReturn {
  departments: DepartmentData[]
  department: DepartmentData | null
  isLoading: boolean
  errors: FormErrors
  setErrors: (errors: FormErrors) => void
  loadDepartments: () => Promise<void>
  loadDepartmentById: (id: string) => Promise<void>
  createDepartment: (data: CreateDepartmentInput) => Promise<void>
  updateDepartment: (id: string, data: UpdateDepartmentInput) => Promise<void>
  deleteDepartment: (id: string) => Promise<void>
}

export function useDepartment(): UseDepartmentReturn {
  const [departments, setDepartments] = useState<DepartmentData[]>([])
  const [department, setDepartment] = useState<DepartmentData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const loadDepartments = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await api.get('/departments')
      setDepartments(response.data)
    } catch (error) {
      console.error('[useDepartment] Erro ao carregar departamentos:', error)
      setDepartments([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadDepartmentById = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await api.get(`/departments/${id}`)
      setDepartment(response.data)
    } catch (error) {
      console.error('[useDepartment] Erro ao carregar departamento:', error)
      setDepartment(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const validateForm = (data: CreateDepartmentInput | UpdateDepartmentInput): boolean => {
    const newErrors: FormErrors = {}

    if ('name' in data && !data.name?.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if ('location' in data && !data.location?.trim()) {
      newErrors.location = 'Localização é obrigatória'
    }

    if ('responsableName' in data && !data.responsableName?.trim()) {
      newErrors.responsableName = 'Nome do responsável é obrigatório'
    }

    if ('responsableEmail' in data && !data.responsableEmail?.trim()) {
      newErrors.responsableEmail = 'Email do responsável é obrigatório'
    } else if (
      'responsableEmail' in data &&
      data.responsableEmail &&
      !/\S+@\S+\.\S+/.test(data.responsableEmail)
    ) {
      newErrors.responsableEmail = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const createDepartment = async (data: CreateDepartmentInput): Promise<void> => {
    if (!validateForm(data)) {
      throw new Error('Formulário inválido')
    }

    try {
      setIsLoading(true)
      const response = await api.post('/departments', data)
      setDepartments((prev) => [...prev, response.data])
      console.log('[useDepartment] Departamento criado:', response.data)
    } catch (error) {
      console.error('[useDepartment] Erro ao criar departamento:', error)
      throw error instanceof Error ? error : new Error('Erro ao criar departamento')
    } finally {
      setIsLoading(false)
    }
  }

  const updateDepartment = async (id: string, data: UpdateDepartmentInput): Promise<void> => {
    if (!validateForm(data as CreateDepartmentInput)) {
      throw new Error('Formulário inválido')
    }

    try {
      setIsLoading(true)
      const response = await api.patch(`/departments/${id}`, data)
      setDepartments((prev) => prev.map((dept) => (dept.id === id ? response.data : dept)))
      setDepartment(response.data)
      console.log('[useDepartment] Departamento atualizado:', response.data)
    } catch (error) {
      console.error('[useDepartment] Erro ao atualizar departamento:', error)
      throw error instanceof Error ? error : new Error('Erro ao atualizar departamento')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteDepartment = async (id: string): Promise<void> => {
    try {
      setIsLoading(true)
      await api.delete(`/departments/${id}`)
      setDepartments((prev) => prev.filter((dept) => dept.id !== id))
      console.log('[useDepartment] Departamento deletado:', id)
    } catch (error) {
      console.error('[useDepartment] Erro ao deletar departamento:', error)
      throw error instanceof Error ? error : new Error('Erro ao deletar departamento')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    departments,
    department,
    isLoading,
    errors,
    setErrors,
    loadDepartments,
    loadDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
  }
}
