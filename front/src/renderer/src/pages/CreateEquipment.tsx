import { useDepartment } from '@hooks/useDepartment'
import { useEquipment } from '@hooks/useEquipment'
import Input from '@renderer/components/Input'
import Sidebar from '@renderer/components/Sidebar'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateEquipment(): React.JSX.Element {
  const navigate = useNavigate()
  const { createEquipment, isLoading, errors } = useEquipment()
  const { departments, loadDepartments } = useDepartment()
  const [formData, setFormData] = useState({
    name: '',
    ean: '',
    alocatedAtId: ''
  })

  useEffect(() => {
    void loadDepartments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    try {
      await createEquipment(formData)
      alert('Equipamento criado com sucesso!')
      // Navigate will trigger Equipment page to load fresh data
      navigate('/equipments')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao criar equipamento')
    }
  }

  return (
    <div className="flex w-screen h-screen bg-white">
      <Sidebar />

      <main className="grow flex flex-col justify-center items-center p-8 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Novo Equipamento</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Nome do Equipamento"
              type="text"
              placeholder="Ex: Notebook Dell"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              labelVariant="default"
            />

            <Input
              label="EAN"
              type="text"
              placeholder="Ex: 1234567890123"
              name="ean"
              value={formData.ean}
              onChange={handleChange}
              error={errors.ean}
              labelVariant="default"
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Departamento</label>
              <select
                name="alocatedAtId"
                value={formData.alocatedAtId}
                onChange={handleChange}
                className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.alocatedAtId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione um departamento</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.alocatedAtId && (
                <span className="text-sm text-red-500">{errors.alocatedAtId}</span>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/equipments')}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition"
              >
                {isLoading ? 'Criando...' : 'Criar Equipamento'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default CreateEquipment
