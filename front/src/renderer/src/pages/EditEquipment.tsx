import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDepartment } from '@hooks/useDepartment'
import { useEquipment } from '@hooks/useEquipment'
import { ComponentData } from '../types/equipment'
import Input from '@renderer/components/Input'
import Sidebar from '@renderer/components/Sidebar'
import AddComponentModal from '@renderer/components/AddComponentModal'
import { ComponentTable } from '@renderer/components/ComponentsTable'
import ConfirmModal from '@renderer/components/ConfirmModal'
import api from '@renderer/services/api'

export default function EditEquipment(): React.JSX.Element {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Hooks
  const { 
    updateEquipment, 
    loadEquipmentById, 
    equipment, 
    isLoading, 
    errors 
  } = useEquipment()
  const { departments, loadDepartments } = useDepartment()

  // Estados Locais
  const [formData, setFormData] = useState({
    name: '',
    ean: '',
    alocatedAtId: '',
    disabled: false
  })

  const [components, setComponents] = useState<ComponentData[]>([])
  const [isAddCompModalOpen, setIsAddCompModalOpen] = useState(false)
  const [compToDelete, setCompToDelete] = useState<string | null>(null)
  const [isTableLoading, setIsTableLoading] = useState(false)

  // 1. Carregar Dados Iniciais (Departamentos + Equipamento + Componentes)
  useEffect(() => {
    void loadDepartments()
    if (id) {
      void loadEquipmentById(id)
      loadComponents()
    }
  }, [id])

  // 2. Preencher formulário quando o equipamento carregar
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


  interface BackendComponent {
    id: string
    name: string
    status: string
  }
  // Função auxiliar para buscar componentes do equipamento
  const loadComponents = useCallback(async () => {
    if (!id) return
    setIsTableLoading(true)
    try {
      const response = await api.get<BackendComponent[]>(`/components/equipment/${id}`)
      
      const formatted = response.data.map((c) => {
        const rawName = c.name || ''
        
        const separatorRegex = /\s+-\s+/;

        let type = 'Geral'
        let model = rawName

        const parts = rawName.split(separatorRegex)

        // 2. Verifica se a divisão funcionou
        if (parts.length >= 2) {
          type = parts[0].trim()

          model = parts.slice(1).join(' - ').trim()
        }

        return {
          id: c.id,
          type: type,
          model: model 
        }
      })
      
      setComponents(formatted)
    } catch (error) {
      console.error('Erro ao carregar componentes', error)
    } finally {
      setIsTableLoading(false)
    }
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  // --- Lógica de Componentes (Live Edit) ---
  // Diferente da criação, na edição salvamos o componente direto no banco

  const handleAddComponent = async (data: { type: string; model: string }): Promise<void> => {
    if (!id) return
    try {
      await api.post('/components', {
        equipmentId: id,
        name: `${data.type} - ${data.model}`,
        status: 'OK'
      })
      await loadComponents() // Recarrega a lista
      setIsAddCompModalOpen(false)
    } catch (error) {
      console.error(error)
      alert('Erro ao adicionar componente')
    }
  }

  const handleConfirmRemoveComponent = async (): Promise<void> => {
    if (!compToDelete || !id) return
    try {
      await api.delete(`/components/${compToDelete}`)
      await loadComponents() // Recarrega a lista
      setCompToDelete(null)
    } catch (error) {
      console.error(error)
      alert('Erro ao remover componente')
    }
  }

  // --- Submit do Formulário Principal ---
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

return (
    <div className="w-screen h-screen bg-(--white) flex justify-center items-center relative">
      <Sidebar />

      <main className="flex w-[1200px] pb-[21px] overflow-hidden flex-col items-center gap-2.5">
        <div className="flex w-full max-w-4xl shrink-0 flex-col gap-6 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Equipamento</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* --- Seção 1: Dados Básicos --- */}
            <div className="flex flex-col gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="text-sm font-semibold text-black">Departamento</label>
                  <select
                    name="alocatedAtId"
                    value={formData.alocatedAtId}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Selecione um departamento</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status (Visível apenas na edição) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-black">Status</label>
                <select
                  name="disabled"
                  value={formData.disabled ? 'true' : 'false'}
                  onChange={(e) => setFormData(prev => ({ ...prev, disabled: e.target.value === 'true' }))}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="false">Ativo</option>
                  <option value="true">Desativado</option>
                </select>
              </div>
            </div>

            {/* --- Seção 2: Componentes --- */}
            <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-black">Componentes Internos</label>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 relative min-h-[100px]">
                {isTableLoading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <span className="text-xs text-gray-500">Carregando lista...</span>
                  </div>
                )}
                <ComponentTable 
                  components={components} 
                  onRemove={(compId) => setCompToDelete(compId)} 
                  onAdd={() => setIsAddCompModalOpen(true)}
                />
              </div>
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
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Modais */}
      <AddComponentModal 
        isOpen={isAddCompModalOpen} 
        onClose={() => setIsAddCompModalOpen(false)}
        onAdd={handleAddComponent}
      />

      <ConfirmModal
        isOpen={!!compToDelete}
        title="Remover Componente"
        message="Tem certeza que deseja remover este componente? Essa ação não pode ser desfeita."
        onConfirm={handleConfirmRemoveComponent}
        onCancel={() => setCompToDelete(null)}
      />
    </div>
  )
}