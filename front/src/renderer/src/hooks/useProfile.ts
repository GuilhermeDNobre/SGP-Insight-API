import { useCallback, useState } from 'react'

export interface UserData {
  id: string
  fullName: string
  email: string
  cnpj: string
  profilePicture?: string
}

interface Passwords {
  currentPassword: string
  newPassword: string
}

interface FormErrors {
  fullName?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}

interface UseProfileReturn {
  userData: UserData
  setUserData: (data: UserData | ((prev: UserData) => UserData)) => void
  passwords: Passwords
  setPasswords: (data: Passwords | ((prev: Passwords) => Passwords)) => void
  errors: FormErrors
  isLoading: boolean
  previewImage: string | null
  updateProfile: (profilePicture?: File) => Promise<void>
  handleImagePreview: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function useProfile(): UseProfileReturn {
  const [userData, setUserData] = useState<UserData>({
    id: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    cnpj: '12.345.678/0001-90'
  })

  const [passwords, setPasswords] = useState<Passwords>({
    currentPassword: '',
    newPassword: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!userData.fullName) {
      newErrors.fullName = 'Nome completo é obrigatório'
    }

    if (!userData.email) {
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
    if (!validateForm()) {
      throw new Error('Formulário inválido')
    }

    try {
      setIsLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Here you would normally send the data to your API
      console.log('Dados atualizados:', { userData, passwords, profilePicture })

      // Clear password fields after successful update
      setPasswords({ currentPassword: '', newPassword: '' })
    } catch {
      throw new Error('Erro ao atualizar perfil')
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
    handleImagePreview
  }
}
