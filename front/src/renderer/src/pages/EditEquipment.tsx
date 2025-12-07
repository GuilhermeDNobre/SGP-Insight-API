import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

interface BackendComponent {
  id: string
  name: string
  status: string
}

export default function EditEquipment(): React.JSX.Element {
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()
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

  // Lista Visual de Componentes (Mistura os do banco com os novos temporários)
  const [components, setComponents] = useState<ComponentData[]>([])
  
  // Lista de IDs que foram removidos pelo usuário e precisam ser deletados no final
  const [componentsToDelete, setComponentsToDelete] = useState<string[]>([])

  // Controle de Modais
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCompId, setEditingCompId] = useState<string | null>(null)
  const [compIdConfirmDelete, setCompIdConfirmDelete] = useState<string | null>(null)

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
      setComponentsToDelete([])
    } catch (error) {
      console.error('Erro ao carregar componentes', error)
    } finally {
      setIsTableLoading(false)
    }
  }, [id])

  // --- HANDLERS LOCAIS (Batch Logic) ---
  // 1. Salvar (Adicionar ou Editar na lista local)
  const handleSaveComponent = (data: { type: string; model: string }): void => {
    if (editingCompId) {
      // MODO EDIÇÃO: Atualiza na lista local
      setComponents(prev => prev.map(c => 
        c.id === editingCompId 
          ? { ...c, type: data.type, model: data.model } // Atualiza campos
          : c
      ))
    } else {
      // MODO ADIÇÃO: Adiciona na lista com ID temporário
      const newComp: ComponentData = {
        id: `temp-${crypto.randomUUID()}`, // Marcador para sabermos que é novo
        type: data.type,
        model: data.model
      }
      setComponents(prev => [...prev, newComp])
    }
    setIsModalOpen(false)
    setEditingCompId(null)
  }

  // 2. Remover (Mover para lista de exclusão ou apenas tirar da memória)
  const handleConfirmRemoveComponent = (): void => {
    if (!compIdConfirmDelete) return

    // Se for um item real (do banco), adiciona à lista de exclusão
    if (!compIdConfirmDelete.startsWith('temp-')) {
      setComponentsToDelete(prev => [...prev, compIdConfirmDelete])
    }

    // Remove da lista visual imediatamente
    setComponents(prev => prev.filter(c => c.id !== compIdConfirmDelete))
    setCompIdConfirmDelete(null)
  }

  // --- SUBMIT FINAL (Envia tudo para a API) ---
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!id) return

    try {
      // 1. Atualiza dados do Equipamento
      await updateEquipment(id, {
        name: formData.name,
        ean: formData.ean,
        alocatedAtId: formData.alocatedAtId,
        disabled: formData.disabled
      })

      // 2. Processa Componentes em Paralelo
      const promises: Promise<unknown>[] = []

      // A) Deletar (Desabilitar) os removidos
      componentsToDelete.forEach(delId => {
        // Chama o DELETE do backend (que faz soft delete/disable)
        promises.push(api.delete(`/components/${delId}`))
      })

      // B) Criar Novos ou Atualizar Existentes
      components.forEach(comp => {
        const payload = {
          equipmentId: id, // Garante o vínculo
          name: `${comp.type} - ${comp.model}`, // Formata para o banco
          status: 'OK'
        }

        if (comp.id.startsWith('temp-')) {
          // É NOVO -> POST
          promises.push(api.post('/components', payload))
        } else {
          // JÁ EXISTE -> PATCH (Atualiza nome/tipo se mudou)
          // Nota: O ID enviado na URL é o ID real do componente
          promises.push(api.patch(`/components/${comp.id}`, {
            name: payload.name
            // Não mandamos status aqui para não sobrescrever nada indesejado
          }))
        }
      })

      await Promise.all(promises)
      
      showSnackbar('Equipamento atualizado com sucesso!', 'success')
      setTimeout(() => navigate('/equipments'), 1500)

    } catch (error) {
      console.error(error)
      showSnackbar(`Erro ao atualizar equipamento. "${error}" `, 'error')
    }
  }

  // --- HANDLERS DE UI ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const openAddModal = (): void => {
    setEditingCompId(null)
    setIsModalOpen(true)
  }

  const openEditModal = (comp: ComponentData): void => {
    setEditingCompId(comp.id)
    setIsModalOpen(true)
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
                  onRemove={(compId) => setCompIdConfirmDelete(compId)} 
                  onEdit={openEditModal} // Passa a função de edição
                  onAdd={openAddModal}   // (Opcional se já tem botão fora)
                />
              </div>
            </div>
            
            {/* --- Rodapé --- */}
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
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveComponent}
        initialData={editingCompId 
          ? { 
              type: components.find(c => c.id === editingCompId)?.type || '',
              model: components.find(c => c.id === editingCompId)?.model || ''
            } 
          : null
        }
      />

      <ConfirmModal
        isOpen={!!compIdConfirmDelete}
        title="Remover Componente"
        message="O componente será removido ao salvar as alterações do equipamento. Deseja continuar?"
        onConfirm={handleConfirmRemoveComponent}
        onCancel={() => setCompIdConfirmDelete(null)}
        variant="danger"
        confirmText="Remover"
        closeOnOverlayClick={false}
      />
    </div>
  )
}