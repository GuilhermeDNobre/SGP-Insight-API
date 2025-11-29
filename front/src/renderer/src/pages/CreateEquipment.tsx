import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from '@renderer/context/SnackbarContext'
import { useDepartment } from '@hooks/useDepartment'
import { useEquipment } from '@hooks/useEquipment'
import { ComponentData } from '../types/equipment'
import Input from '@renderer/components/Input'
import Sidebar from '@renderer/components/Sidebar'
import AddComponentModal from '@renderer/components/AddComponentModal'
import { ComponentTable } from '@renderer/components/ComponentsTable'
import ConfirmModal from '@renderer/components/ConfirmModal'
import api from '@renderer/services/api'

function CreateEquipment(): React.JSX.Element {
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()

  const { createEquipment, isLoading, errors } = useEquipment()
  const { departments, loadDepartments } = useDepartment()

  const [formData, setFormData] = useState({
    name: '',
    ean: '',
    alocatedAtId: '',
    disabled: false
  })

  const [components, setComponents] = useState<ComponentData[]>([])

  const [editingCompId, setEditingCompId] = useState<string | null>(null)

  const [isAddCompModalOpen, setIsAddCompModalOpen] = useState(false)
  const [compToDelete, setCompToDelete] = useState<string | null>(null)

  useEffect(() => {
    void loadDepartments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({
      ...prev,
      [name]: val
    }))
  }

  const handleSaveComponent = (data: { type: string; model: string }): void => {
    if (editingCompId) {
      setComponents((prev) => 
        prev.map((comp) => 
          comp.id === editingCompId 
            ? { ...comp, type: data.type, model: data.model } // Atualiza os dados
            : comp
        )
      )
    } else {
      const newComp: ComponentData = {
        id: crypto.randomUUID(),
        type: data.type,
        model: data.model
      }
      setComponents((prev) => [...prev, newComp])
    }
    
    // Fecha e limpa
    setIsAddCompModalOpen(false)
    setEditingCompId(null)
  }

  const handleOpenAddModal = (): void => {
    setEditingCompId(null) // Garante que não estamos editando ninguém
    setIsAddCompModalOpen(true)
  }

  const handleOpenEditModal = (comp: ComponentData): void => {
    setEditingCompId(comp.id) // Marca quem vamos editar
    setIsAddCompModalOpen(true)
  }

  const handleConfirmRemoveComponent = (): void => {
    if (compToDelete) {
      setComponents((prev) => prev.filter((c) => c.id !== compToDelete))
      setCompToDelete(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    try {
      // 1. Cria o Equipamento (sem componentes)
      const newEquipment = await createEquipment({
        name: formData.name,
        ean: formData.ean,
        alocatedAtId: formData.alocatedAtId
      })

      // 2. Se tiver componentes, salva um por um
      if (components.length > 0 && newEquipment?.id) {
        const promises = components.map(comp => {
          return api.post('/components', {
            equipmentId: newEquipment.id,
            name: `${comp.type} - ${comp.model}`, 
            status: 'OK'
          })
        })
        
        await Promise.all(promises)
      }

      showSnackbar('Equipamento criado com sucesso!', 'success')
      setTimeout(() => navigate('/equipments'), 1500)
    } catch (error) {
      console.error('Erro:', error)
      showSnackbar(`Erro ao criar equipamento. "${error}" `, 'error')
    }
  }

  return (
    <div className="w-screen h-screen bg-(--white) flex justify-center items-center relative">
      <Sidebar />

      <main className="flex w-[1200px] pb-[21px] overflow-hidden flex-col items-center gap-2.5">
        <div className="flex w-full max-w-4xl shrink-0 flex-col gap-6 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Novo Equipamento</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* --- Section 1: Basic Info --- */}
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
                    className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
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
              </div>
            </div>

            {/* --- Section 2: Components Management --- */}
            <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-black">Componentes Internos</label>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50">
                {/* MUDANÇA 4: Passando as novas props para a Tabela */}
                <ComponentTable 
                  components={components} 
                  onRemove={(id) => setCompToDelete(id)} 
                  onEdit={handleOpenEditModal} // Passa a função de abrir edição
                  onAdd={handleOpenAddModal}   // Passa a função de abrir adição
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
                {isLoading ? 'Criando...' : 'Criar Equipamento'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* --- Modals --- */}
      
      <AddComponentModal 
        isOpen={isAddCompModalOpen} 
        onClose={() => setIsAddCompModalOpen(false)}
        onSave={handleSaveComponent} 
        // Preenche os dados se estiver editando
        initialData={editingCompId 
          ? { 
              type: components.find(c => c.id === editingCompId)?.type || '',
              model: components.find(c => c.id === editingCompId)?.model || ''
            } 
          : null
        }
      />

      <ConfirmModal
        isOpen={!!compToDelete}
        title="Remover Componente"
        message="Tem certeza que deseja remover este componente da lista?"
        onConfirm={handleConfirmRemoveComponent}
        onCancel={() => setCompToDelete(null)}
        variant="danger"
        confirmText="Excluir"
        closeOnOverlayClick={false}
      />
    </div>
  )
}

export default CreateEquipment