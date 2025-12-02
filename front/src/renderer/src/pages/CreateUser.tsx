import Button from '@components/Button'
import Input from '@components/Input'
import Sidebar from '@components/Sidebar'
import api from '@services/api'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CreateUser(): React.JSX.Element {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    role: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ firstName?: string; email?: string; role?: string }>({})

  const handleChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  const validateForm = (): boolean => {
    const newErrors: { firstName?: string; email?: string; role?: string } = {}

    if (!formData.firstName) newErrors.firstName = 'Nome é obrigatório'
    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }
    if (!formData.role) newErrors.role = 'Cargo é obrigatório'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      await api.post('/api/users', formData) // Update the endpoint if necessary
      navigate('/list-users') // Redirect to the user list after successful creation
    } catch (err: any) {
      console.error(err)
      if (err.response && err.response.data && err.response.data.message) {
        alert(`Erro: ${err.response.data.message}`) // Display the error message
      } else {
        alert('Erro ao criar usuário. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center relative py-[120px]">
      <Sidebar />

      <div className="flex w-full max-w-[800px] h-screen overflow-hidden py-20 px-8 flex-col items-start gap-6">
        <h1 className="font-bold text-2xl leading-normal">Criar Novo Usuário</h1>

        <form className="flex flex-col gap-4 w-full">
          <Input
            label="Nome"
            value={formData.firstName}
            labelVariant="default"
            onChange={handleChange('firstName')}
            error={errors.firstName}
          />
          <Input
            label="E-mail"
            type="email"
            labelVariant="default"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
          />
          <Input
            label="Cargo"
            labelVariant="default"
            value={formData.role}
            onChange={handleChange('role')}
            error={errors.role}
          />
          <div className="flex justify-end gap-2">
            <Button
              label="Cancelar"
              variant="secondary"
              onClick={() => navigate('/list-users')}
              disabled={isSubmitting}
            />
            <Button
              label={isSubmitting ? 'Processando...' : 'Salvar'}
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
