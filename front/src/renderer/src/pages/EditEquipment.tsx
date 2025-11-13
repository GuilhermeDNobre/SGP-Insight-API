import { useDepartment } from '@hooks/useDepartment'
import { useEquipment } from '@hooks/useEquipment'
import Input from '@renderer/components/Input'
import Sidebar from '@renderer/components/Sidebar'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditEquipment(): React.JSX.Element {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { equipment, isLoading, errors, loadEquipmentById, updateEquipment } = useEquipment()
  const { departments, loadDepartments } = useDepartment()
  const [formData, setFormData] = useState({
    name: '',
    ean: '',
    alocatedAtId: '',
    disabled: false
  })

  useEffect(() => {
    if (id) {
      void loadEquipmentById(id)
      void loadDepartments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name,
        ean: equipment.ean,
        alocatedAtId: equipment.alocatedAtId,
        disabled: equipment.disabled
      })
    }
  }, [equipment])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({
      ...prev,
      [name]: val
    }))
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!id) return

    try {
      await updateEquipment(id, {
        name: formData.name,
        ean: formData.ean,
        alocatedAtId: formData.alocatedAtId,
        disabled: formData.disabled
      })
      alert('Equipamento atualizado com sucesso!')
      navigate('/equipments')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao atualizar equipamento')
    }
  }

  if (isLoading && !equipment) {
    return (
      <div className="flex w-screen h-screen bg-white">
        <Sidebar />
        <main className="grow flex justify-center items-center">
          <p className="text-gray-500">Carregando equipamento...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex w-screen h-screen bg-white">
      <Sidebar />

      <main className="grow flex flex-col justify-center items-center p-8 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Equipamento</h2>

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

            <div className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="disabled"
                name="disabled"
                checked={formData.disabled}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="disabled" className="text-sm font-medium text-gray-700">
                Desativar equipamento
              </label>
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
                {isLoading ? 'Atualizando...' : 'Atualizar Equipamento'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default EditEquipment
