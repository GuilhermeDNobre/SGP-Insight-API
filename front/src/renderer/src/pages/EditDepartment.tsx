import { useDepartment } from '@hooks/useDepartment'
import Input from '@renderer/components/Input'
import Sidebar from '@renderer/components/Sidebar'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditDepartment(): React.JSX.Element {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { department, isLoading, errors, loadDepartmentById, updateDepartment } = useDepartment()
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    responsableName: '',
    responsableEmail: ''
  })

  useEffect(() => {
    if (id) {
      void loadDepartmentById(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        location: department.location,
        responsableName: department.responsableName,
        responsableEmail: department.responsableEmail
      })
    }
  }, [department])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!id) return

    try {
      await updateDepartment(id, formData)
      alert('Departamento atualizado com sucesso!')
      navigate('/departments')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao atualizar departamento')
    }
  }

  if (isLoading && !department) {
    return (
      <div className="flex w-screen h-screen bg-white">
        <Sidebar />
        <main className="grow flex justify-center items-center">
          <p className="text-gray-500">Carregando departamento...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex w-screen h-screen bg-white">
      <Sidebar />

      <main className="grow flex flex-col justify-center items-center p-8 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Departamento</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Nome do Departamento"
              type="text"
              placeholder="Ex: TI"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              labelVariant="default"
            />

            <Input
              label="Localização"
              type="text"
              placeholder="Ex: Sala 101"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              labelVariant="default"
            />

            <Input
              label="Nome do Responsável"
              type="text"
              placeholder="Ex: João Silva"
              name="responsableName"
              value={formData.responsableName}
              onChange={handleChange}
              error={errors.responsableName}
              labelVariant="default"
            />

            <Input
              label="Email do Responsável"
              type="email"
              placeholder="Ex: joao@example.com"
              name="responsableEmail"
              value={formData.responsableEmail}
              onChange={handleChange}
              error={errors.responsableEmail}
              labelVariant="default"
            />

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/departments')}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition"
              >
                {isLoading ? 'Atualizando...' : 'Atualizar Departamento'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default EditDepartment
