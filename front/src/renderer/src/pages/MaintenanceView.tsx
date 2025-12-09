import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMaintenance } from '@hooks/useMaintenance'
import { useSnackbar } from '@renderer/context/SnackbarContext'
import Sidebar from '@renderer/components/Sidebar'
import Button from '@renderer/components/Button'
import ConfirmModal from '@renderer/components/ConfirmModal'
import { ComponentTable } from '@renderer/components/ComponentsTable'
import { ComponentData } from '@renderer/types/equipment'
import { ArrowLeft, Pencil, CheckCircle } from 'lucide-react'

export default function MaintenanceDetails(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()

  const { loadMaintenanceById, maintenance, isLoading, finishMaintenance } = useMaintenance()
  
  const [components, setComponents] = useState<ComponentData[]>([])
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false)

  useEffect(() => {
    if (id) {
      void loadMaintenanceById(id)
    }
  }, [id, loadMaintenanceById])

  // Formata os componentes quando a manutenção é carregada
  useEffect(() => {
    if (maintenance?.components) {
      const formatted = maintenance.components.map((relation: { component: { id: string; name: string } }) => {
        const c = relation.component
        const rawName = c.name || ''
        const separatorRegex = /\s+-\s+/
        
        let type = 'Geral'
        let model = rawName
        
        const parts = rawName.split(separatorRegex)
        if (parts.length >= 2) {
          type = parts[0].trim()
          model = parts.slice(1).join(' - ').trim()
        }

        return { id: c.id, type, model }
      })
      setComponents(formatted)
    }
  }, [maintenance])

  const handleConfirmFinish = async (): Promise<void> => {
    if (!id) return
    try {
      await finishMaintenance(id)
      showSnackbar('Manutenção finalizada com sucesso!', 'success')
      void loadMaintenanceById(id) // Recarrega para atualizar o status na tela
    } catch (error) {
      showSnackbar(`Erro ao finalizar manutenção. "${error}" `, 'error')
    } finally {
      setIsFinishModalOpen(false)
    }
  }

  if (isLoading || !maintenance) {
    return (
      <div className="flex w-screen h-screen bg-gray-100 items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <main className="grow flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg w-[800px] h-[520px] flex flex-col border border-gray-200">
          
          {/* Header */}
          <div className="p-8 border-b border-gray-100 flex justify-between items-start shrink-0">
            <div>
              <button 
                onClick={() => navigate('/maintenance')}
                className="flex items-center text-gray-500 hover:text-gray-700 mb-2 text-sm transition"
              >
                <ArrowLeft size={16} className="mr-1" /> Voltar para lista
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Detalhes da Manutenção</h1>
              <p className="text-sm text-gray-400 mt-1">ID: {maintenance.id}</p>
            </div>
            
            <div className="flex gap-2">
              {maintenance.status !== 'TERMINADA' && (
                <>
                  <Button
                    label="Editar"
                    variant="secondary"
                    endIcon={<Pencil size={16} />}
                    onClick={() => navigate(`/maintenance-edit/${maintenance.id}`)}
                  />
                  <Button
                    label="Finalizar"
                    variant="success"
                    endIcon={<CheckCircle size={16} />}
                    onClick={() => setIsFinishModalOpen(true)}
                  />
                </>
              )}
            </div>
          </div>

          {/* Corpo */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
            
            {/* Grid de Informações */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Equipamento</span>
                <span className="text-lg font-medium text-gray-900 block">{maintenance.equipment?.name || 'N/A'}</span>
                <span className="text-sm text-gray-500 font-mono">{maintenance.equipment?.ean}</span>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Status</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold mt-1
                  ${maintenance.status === 'ABERTA' ? 'bg-blue-100 text-blue-800' : 
                    maintenance.status === 'EM_ANDAMENTO' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'}`}>
                  {maintenance.status.replace('_', ' ')}
                </span>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Técnico Responsável</span>
                <span className="text-lg text-gray-800">{maintenance.technician}</span>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Datas</span>
                <div className="text-sm text-gray-800">
                  <p><strong>Abertura:</strong> {new Date(maintenance.createdAt).toLocaleDateString()}</p>
                  {maintenance.finishedAt && (
                    <p><strong>Conclusão:</strong> {new Date(maintenance.finishedAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Descrição do Problema</h3>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 leading-relaxed whitespace-pre-wrap">
                {maintenance.description}
              </div>
            </div>

            {/* Componentes Afetados */}
            {components.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2">Componentes Afetados</h3>
                <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50 min-h-[100px]">
                  <ComponentTable components={components} />
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      <ConfirmModal
        isOpen={isFinishModalOpen}
        title="Finalizar Manutenção"
        message="Deseja marcar esta manutenção como concluída? O equipamento voltará a ficar disponível."
        onConfirm={handleConfirmFinish}
        onCancel={() => setIsFinishModalOpen(false)}
        variant="success"
        confirmText="Finalizar"
      />
    </div>
  )
}