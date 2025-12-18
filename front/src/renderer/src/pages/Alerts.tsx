import React, { useState, useEffect } from 'react'
import Sidebar from '@components/Sidebar'
import Input from '@components/Input'
import Button from '@components/Button'
import AlertCard from '@components/AlertCard'
import AlertModal, { AlertFilters } from '@components/AlertModal'
import { ListFilter} from 'lucide-react'
import { useAlerts } from '@renderer/hooks/useAlerts'

export default function Alerts(): React.JSX.Element {
  const { alerts, isLoading, loadAlerts, page, totalPages, changePage } = useAlerts()

  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<AlertFilters>({})

  useEffect(() => {
    void loadAlerts(page, searchTerm, activeFilters)
  }, [loadAlerts, page, activeFilters])

  const handleSearch = (): void => {
    void loadAlerts(1, searchTerm, activeFilters)
  }

  const handleApplyFilter = (newFilters: AlertFilters): void => {
    setActiveFilters(newFilters)
    changePage(1)
    setIsFilterModalOpen(false)
  }

  const clearFilter = (key: keyof AlertFilters): void => {
    const newFilters = { ...activeFilters }
    delete newFilters[key]
    setActiveFilters(newFilters)
    changePage(1)
  }

  const hasFilters = Object.values(activeFilters).some(
     (value) => value !== undefined && value !== null && value !== ''
  )
  
  return (
    <div className="flex w-screen h-screen bg-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-10 bg-white ml-14">
        
        {/* Cabeçalho */}
        <div className="flex flex-col gap-2 mb-6 pt-10">
          <h1 className="text-2xl font-bold text-[var(--txt)]">Alertas</h1>

          {/* Barra de Busca, Botão Filtrar */}
          <div className="flex gap-2 w-full">
            <Input 
              labelVariant="default"
              type="search"
              placeholder="Digite o Departamento, Equipamento ou Componente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="h-[30px] flex-1"
            />
            <Button 
              label="Filtrar"
              variant="primary"
              endIcon={<ListFilter size={16} />}
              className="h-[30px]"
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>

          {/* Feedback de Filtros Ativos */}
          <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500 min-h-[24px] pb-2">
                <span className="mr-2">
                    {isLoading ? 'Carregando...' : `${alerts.length} alertas encontrados`}
                </span>
                
                {/* Tag Trimestre: Use !== undefined */}
                {activeFilters.trimestre !== undefined && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 border border-blue-200">
                    {activeFilters.trimestre}º Trimestre
                    <button onClick={() => clearFilter('trimestre')} className="hover:text-blue-950 font-bold">×</button>
                    </span>
                )}

                {/* Tag Ocorrências: Use !== undefined (para não esconder se for 0) */}
                {activeFilters.occurrenceCount !== undefined && (
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 border border-purple-200">
                    Min. {activeFilters.occurrenceCount} Ocorrências
                    <button onClick={() => clearFilter('occurrenceCount')} className="hover:text-purple-950 font-bold">×</button>
                    </span>
                )}

                {/* Tag Datas */}
                {(activeFilters.startDate || activeFilters.endDate) && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 border border-green-200">
                    Período: {activeFilters.startDate ? new Date(activeFilters.startDate).toLocaleDateString() : '...'} até {activeFilters.endDate ? new Date(activeFilters.endDate).toLocaleDateString() : '...'}
                    <button onClick={() => { clearFilter('startDate'); clearFilter('endDate'); }} className="hover:text-green-950 font-bold">×</button>
                    </span>
                )}

                {hasFilters && (
                    <button 
                    onClick={() => { setActiveFilters({}); }}
                    className="text-xs text-red-500 hover:underline ml-2"
                    >
                    Limpar tudo
                    </button>
                )}
          </div>
        </div>

        {/* Lista de Alertas */}
        <div className="flex flex-col gap-4 mb-8">
          {!isLoading && alerts.map((alert) => (
            <AlertCard 
              key={alert.id} 
              data={{
                id: Number(alert.id) || 0, // Fallback caso id seja uuid string e card espere number
                title: `Recorrência: ${alert.occurrenceCount}x`, 
                subtitle: alert.equipment?.name || alert.component?.name || 'Item Desconhecido',
                date: new Date(alert.lastRecurrenceAt || alert.createdAt).toLocaleDateString('pt-BR') + ` - ${alert.equipment?.alocatedAt?.name || 'S/ Setor'}`,
                quarter: `${alert.trimestre}º Trimestre`,
                description: alert.description
              }} 
            />
          ))}
          
          {!isLoading && alerts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              <p>Nenhum alerta encontrado.</p>
            </div>
          )}
        </div>

        {/* Paginação */}
        <div className="border-t border-gray-200 py-4 flex items-center justify-between bg-gray-50 shrink-0 mt-auto">
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
                disabled={page >= totalPages || isLoading}
                className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                Próximo
                </button>
            </div>
        </div>
      </main>

      {/* Modal de Filtro */}
      <AlertModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
        onApply={handleApplyFilter}
        initialFilters={activeFilters}
      />
    </div>
  )
}