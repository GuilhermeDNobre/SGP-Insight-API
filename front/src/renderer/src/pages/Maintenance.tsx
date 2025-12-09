import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMaintenance } from '@hooks/useMaintenance'
import { useSnackbar } from '@renderer/context/SnackbarContext'
import Sidebar from '@renderer/components/Sidebar'
import Button from '@renderer/components/Button'
import Input from '@renderer/components/Input'
import ConfirmModal from '@renderer/components/ConfirmModal'
import { Plus, Eye, Edit, Trash2, CheckCircle } from 'lucide-react'

export default function Maintenances(): React.JSX.Element {
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()
  
  const { 
    maintenances, 
    isLoading, 
    loadMaintenances, 
    deleteMaintenance, 
    finishMaintenance,
    page
  } = useMaintenance()

  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [finishModalOpen, setFinishModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    void loadMaintenances(page, searchTerm)
  }, [loadMaintenances, page]) // Remova searchTerm daqui se quiser buscar só no Enter

  const handleSearch = (): void => {
    void loadMaintenances(1, searchTerm)
  }

  // --- Handlers de Ação ---
  const handleOpenDelete = (id: string): void => {
    setSelectedId(id)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async (): Promise<void> => {
    if (!selectedId) return
    try {
      await deleteMaintenance(selectedId)
      showSnackbar('Manutenção excluída com sucesso!', 'success')
      await loadMaintenances(page)
    } catch (error) {
      showSnackbar(`Erro ao excluir manutenção. "${error}" `, 'error')
    } finally {
      setDeleteModalOpen(false)
      setSelectedId(null)
    }
  }

  const handleOpenFinish = (id: string): void => {
    setSelectedId(id)
    setFinishModalOpen(true)
  }

  const handleConfirmFinish = async (): Promise<void> => {
    if (!selectedId) return
    try {
      await finishMaintenance(selectedId)
      showSnackbar('Manutenção finalizada com sucesso!', 'success')
      await loadMaintenances(page)
    } catch (error) {
      showSnackbar(`Erro ao finalizar manutenção. "${error}" `, 'error')
    } finally {
      setFinishModalOpen(false)
      setSelectedId(null)
    }
  }

  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center relative py-[120px]">
      <Sidebar />
      <main className="flex w-full max-w-[1400px] h-screen overflow-hidden py-20 px-8 flex-col items-start gap-2.5">
        
        {/* Header */}
        <div className="flex flex-col w-full gap-2.5 shrink-0 top-[120px] bg-white pb-4 z-10">
          <h1 className="font-bold text-2xl leading-normal">Manutenções</h1>
          <div className="flex flex-row gap-2.5 w-full">
            <Input 
              placeholder="Buscar por técnico ou equipamento..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)} // Atualiza estado
              onKeyDown={e => {
                if (e.key === 'Enter') handleSearch() // Busca ao dar Enter
              }}
              labelVariant="default"
              className="h-[30px] flex-1"
              type='search'
            />
            <Button 
              label="Nova Manutenção"
              onClick={() => navigate('/maintenance-create')}
              className="h-10h-[30px] w-[196px] whitespace-nowrap"
              endIcon={<Plus size={18} />}
            />
          </div>
        </div>

        {/* Tabela */}
        <div className="rounded-lg flex-1 overflow-auto bg-white shadow-sm w-full">
          <table className="text-left text-sm text-gray-600 w-full border-collapse">
            <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-700 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4">Equipamento</th>
                <th className="px-6 py-4">Responsável</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Data Abertura</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                    <td colSpan={5} className="text-center py-20">
                      <div className="flex flex-col justify-center items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                      <p className="text-gray-500 text-lg">Carregando equipamentos...</p>
                    </div>
                  </td>
                </tr>
              ) : maintenances.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-20">Nenhuma manutenção encontrada.</td></tr>
              ) : (
                maintenances.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-duration-150">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.equipment?.name || 'N/A'}</td>
                    <td className="px-6 py-4">{item.technician}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold
                        ${item.status === 'ABERTA' ? 'bg-blue-100 text-blue-800' : 
                          item.status === 'EM_ANDAMENTO' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button
                        title='Ver Detalhes' 
                        onClick={() => 
                          navigate(`/maintenance-details/${item.id}`)
                        }
                        className="p-1 text-gray-500 hover:bg-gray-100 rounded">
                        <Eye size={18} />
                      </button>

                      {/* Só mostra Editar e Finalizar se não estiver TERMINADA */}
                      {item.status !== 'TERMINADA' && (
                        <>
                          <button 
                            title='Editar'
                            onClick={() => 
                              navigate(`/maintenance-edit/${item.id}`)
                            } 
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit size={18} />
                          </button>

                          <button 
                            title='Finalizar Manutenção'
                            onClick={() =>
                              handleOpenFinish(item.id)
                            } 
                            className="p-1 text-green-600 hover:bg-green-50 rounded">
                            <CheckCircle size={18} />
                          </button>
                        </>
                      )}

                      <button 
                        title='Remover Manutenção'
                        onClick={() =>
                          handleOpenDelete(item.id)
                        } 
                        className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modais */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          title="Excluir Manutenção"
          message="Tem certeza? Isso apagará o registro permanentemente."
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalOpen(false)}
          variant="danger"
        />
        
        <ConfirmModal
          isOpen={finishModalOpen}
          title="Finalizar Manutenção"
          message="Deseja marcar esta manutenção como concluída? O equipamento voltará a ficar disponível."
          onConfirm={handleConfirmFinish}
          onCancel={() => setFinishModalOpen(false)}
          variant="success"
          confirmText="Finalizar"
        />

      </main>
    </div>
  )
}