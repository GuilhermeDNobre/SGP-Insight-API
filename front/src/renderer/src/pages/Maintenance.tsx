import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMaintenance } from '@hooks/useMaintenance'
import { useSnackbar } from '@renderer/context/SnackbarContext'
import Sidebar from '@renderer/components/Sidebar'
import Button from '@renderer/components/Button'
import Input from '@renderer/components/Input'
import ConfirmModal from '@renderer/components/ConfirmModal'
import MaintenanceFilterModal, { MaintenanceFilterValues } from '@renderer/components/MaintenanceFilterModal'
import { Plus, Eye, Edit, Trash2, CheckCircle, ListFilter } from 'lucide-react'

export default function Maintenances(): React.JSX.Element {
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()
  
  const { 
    maintenances, 
    isLoading, 
    loadMaintenances, 
    deleteMaintenance, 
    finishMaintenance,
    page,
    totalPages,
    changePage
  } = useMaintenance()

  const [searchTerm, setSearchTerm] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<MaintenanceFilterValues>({})

  useEffect(() => {
    void loadMaintenances(page, appliedSearch, activeFilters)
  }, [loadMaintenances, page, appliedSearch, activeFilters])

  const handleSearchTrigger = (): void => {
    setAppliedSearch(searchTerm)
    changePage(1)
  }

  const handleApplyFilters = (filters: MaintenanceFilterValues): void => {
    setActiveFilters(filters)
    void loadMaintenances(1, searchTerm, filters)
    setIsFilterModalOpen(false)
  }

  const handleClearFilters = (): void => {
    setActiveFilters({})
    changePage(1)
    setIsFilterModalOpen(false)
  }

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [finishModalOpen, setFinishModalOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    void loadMaintenances(page, searchTerm)
  }, [loadMaintenances, page]) // Remova searchTerm daqui se quiser buscar só no Enter

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

  const clearFilter = (key: keyof MaintenanceFilterValues): void => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key]; // Remove a chave fisicamente do objeto
      return newFilters;
    });
  };
    
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
              onKeyDown={(e) => { 
                e.key === 'Enter' &&handleSearchTrigger() // Busca ao dar Enter
              }}
              labelVariant="default"
              className="h-[30px] flex-1"
              type='search'
            />
            <Button 
              label="Nova Manutenção"
              variant='secondary'
              onClick={() => navigate('/maintenance-create')}
              className="h-10h-[30px] w-[196px] whitespace-nowrap"
              endIcon={<Plus size={18} />}
            />
            <Button
              label="Filtrar"
              variant="primary"
              endIcon={<ListFilter size={16} />}
              className={`h-[30px] ${Object.keys(activeFilters).length > 0 ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
          {(activeFilters.status || activeFilters.openDate || activeFilters.closeDate) && (
            <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">Filtros ativos:</span>
              
              {activeFilters.status && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs border border-blue-100">
                  <span className="font-semibold">Status:</span> 
                  {activeFilters.status.split(',').map(s => s.replace('_', ' ')).join(', ').toLowerCase()}
                  <button onClick={() => clearFilter('status')} className="ml-1 hover:text-blue-900 font-bold">×</button>
                </span>
              )}

              {activeFilters.openDate && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs border border-green-100">
                  <span className="font-semibold">Abertura:</span> 
                  {/* Força o display da string exata para não confundir visualmente */}
                  {activeFilters.openDate.split('-').reverse().join('/')}
                  <button onClick={() => clearFilter('openDate')} className="ml-1 hover:text-green-900 font-bold">×</button>
                </span>
              )}

              {activeFilters.closeDate && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-orange-50 text-orange-700 text-xs border border-orange-100">
                  <span className="font-semibold">Conclusão:</span> 
                  {activeFilters.closeDate.split('-').reverse().join('/')}
                  <button onClick={() => clearFilter('closeDate')} className="ml-1 hover:text-orange-900 font-bold">×</button>
                </span>
              )}

              <button 
                onClick={handleClearFilters}
                className="text-xs text-red-500 hover:text-red-700 hover:underline ml-2 font-medium"
              >
                Limpar tudo
              </button>
            </div>
          )}
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col flex-1 overflow-hidden w-full">
          <div className="overflow-auto flex-1 ">
            <table className="text-left text-sm text-gray-600 w-full border-collapse">
              <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-700 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4">Equipamento</th>
                  <th className="px-6 py-4">Responsável</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Data Abertura</th>
                  <th className="px-6 py-4">Data Conclusão</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                      <td colSpan={5} className="text-center py-20">
                        <div className="flex flex-col justify-center items-center gap-3">
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                        <p className="text-gray-500 text-lg">Carregando manutenções...</p>
                      </div>
                    </td>
                  </tr>
                ) : maintenances.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-20">Nenhuma manutenção encontrada.</td></tr>
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
                      {item.finishedAt ? (
                        <td className="px-6 py-4">{new Date(item.finishedAt).toLocaleDateString()}</td>
                      ) : (
                        <td className="px-6 py-4 text-gray-400 italic">Em andamento</td>
                      )}
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
          
          {/* Rodapé de Paginação */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50 shrink-0">
            <span className="text-sm text-gray-700">
              Página <span className="font-semibold text-gray-900">{page}</span> de <span className="font-semibold text-gray-900">{totalPages || 1}</span>
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={() => changePage(page - 1)}
                disabled={page === 1 || isLoading}
                className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Anterior
              </button>
              <button
                onClick={() => changePage(page + 1)}
                disabled={page === totalPages || isLoading}
                className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Próximo
              </button>
            </div>
          </div>
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

      <MaintenanceFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        currentFilters={activeFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
    </div>
  )
}