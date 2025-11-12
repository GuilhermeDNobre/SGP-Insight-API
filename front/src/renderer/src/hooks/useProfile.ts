import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from './useAuth'

export interface UserData {
  id: string
  firstName: string
  email: string
  role: 'ADMIN' | 'MANAGER'
  profilePicture?: string
}

interface Passwords {
  currentPassword: string
  newPassword: string
}

interface FormErrors {
  firstName?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}

interface UseProfileReturn {
  userData: UserData | null
  setUserData: (data: UserData | ((prev: UserData | null) => UserData | null)) => void
  passwords: Passwords
  setPasswords: (data: Passwords | ((prev: Passwords) => Passwords)) => void
  errors: FormErrors
  isLoading: boolean
  previewImage: string | null
  updateProfile: (profilePicture?: File) => Promise<void>
  handleImagePreview: (e: React.ChangeEvent<HTMLInputElement>) => void
  deleteProfile: () => Promise<void>
  loadUserData: () => Promise<void>
}

export function useProfile(): UseProfileReturn {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [passwords, setPasswords] = useState<Passwords>({
    currentPassword: '',
    newPassword: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const { getToken, logout } = useAuth()
  const location = useLocation()

  // Carregar dados do usuário na montagem do componente
  const loadUserData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      const token = getToken()
      if (!token) {
        throw new Error('Token não encontrado')
      }

      // Decodificar JWT para pegar o userId
      const parts = token.split('.')
      if (parts.length !== 3) throw new Error('Token inválido')

      const decoded = JSON.parse(atob(parts[1]))
      console.log('[Profile] Dados do token:', decoded)

      // Atualizar userData com os dados do token (que já contém userId, email, role)
      setUserData({
        id: decoded.userId,
        firstName: decoded.email.split('@')[0], // Usamos o email como fallback
        email: decoded.email,
        role: decoded.role
      })

      // Limpar erros ao carregar com sucesso
      setErrors({})
    } catch (error) {
      console.error('[Profile] Erro ao carregar dados:', error)
      setErrors({
        firstName: error instanceof Error ? error.message : 'Erro ao carregar perfil'
      })
    } finally {
      setIsLoading(false)
    }
  }, [getToken])

  // Carregar dados ao montar o componente e quando voltar para /profile
  useEffect(() => {
    if (location.pathname === '/profile') {
      console.log('[Profile] Voltando para /profile, recarregando dados...')
      loadUserData()
    }
  }, [location.pathname, loadUserData])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!userData?.firstName) {
      newErrors.firstName = 'Nome é obrigatório'
    }

    if (!userData?.email) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'E-mail inválido'
    }

    if (passwords.newPassword && !passwords.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória para alterar a senha'
    }

    if (passwords.newPassword && passwords.newPassword.length < 6) {
      newErrors.newPassword = 'A nova senha deve ter pelo menos 6 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImagePreview = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const updateProfile = async (profilePicture?: File): Promise<void> => {
    if (!validateForm() || !userData) {
      throw new Error('Formulário inválido')
    }

    try {
      setIsLoading(true)

      // Preparar dados para atualização
      const updateData = {
        firstName: userData.firstName,
        email: userData.email,
        password: passwords.newPassword || undefined
      }

      console.log('[Profile] Atualizando perfil com:', updateData)

      // Fazer requisição para atualizar perfil
      const response = await api.patch('/users', updateData)

      console.log('[Profile] Perfil atualizado:', response.data)

      // Atualizar userData local com dados retornados
      setUserData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          firstName: response.data.firstName || prev.firstName,
          email: response.data.email || prev.email
        }
      })

      // Limpar campos de senha
      setPasswords({ currentPassword: '', newPassword: '' })
    } catch (error) {
      console.error('[Profile] Erro ao atualizar:', error)
      throw error instanceof Error ? error : new Error('Erro ao atualizar perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteProfile = async (): Promise<void> => {
    try {
      setIsLoading(true)

      if (!userData) {
        throw new Error('Dados do usuário não encontrados')
      }

      console.log('[Profile] Deletando perfil:', userData.id)

      // Fazer requisição para deletar perfil (soft delete)
      await api.delete(`/users/${userData.id}`)

      console.log('[Profile] Perfil deletado com sucesso')

      // Logout e redirecionar
      logout()
    } catch (error) {
      console.error('[Profile] Erro ao deletar:', error)
      throw error instanceof Error ? error : new Error('Erro ao deletar perfil')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    userData,
    setUserData,
    passwords,
    setPasswords,
    errors,
    isLoading,
    previewImage,
    updateProfile,
    handleImagePreview,
    deleteProfile,
    loadUserData
  }
}
