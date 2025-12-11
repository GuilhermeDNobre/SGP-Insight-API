import React from 'react'
import { Eye } from 'lucide-react'

// Definição do tipo de dado esperado por esta tabela
export interface MaintenanceTableData {
  id: string
  status: 'ABERTA' | 'TERMINADA'
  description: string
  technician: string
  createdAt: string
  finishedAt?: string
}

interface MaintenancesTableProps {
  maintenances: MaintenanceTableData[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onViewDetails: (id: string) => void
}

export default function MaintenancesTable({
  maintenances,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails
}: MaintenancesTableProps): React.JSX.Element {

  // Helper local para renderizar o Badge de status
  const getStatusBadge = (status: string): React.JSX.Element => {
    switch (status) {
      case 'ABERTA':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">Aberta</span>
      case 'TERMINADA':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800">Concluída</span>
      default:
        return <span className="text-gray-500">-</span>
    }
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200">
      {/* Tabela */}
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-100 font-semibold text-gray-700">
          <tr>
            <th className="px-4 py-3 whitespace-nowrap">Data Abertura</th>
            <th className="px-4 py-3">Data Conclusão</th>
            <th className="px-4 py-3">Técnico</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {isLoading ? (
            <tr>
              <td colSpan={4} className="text-center py-8">
                <div className="flex justify-center items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                  <span>Carregando manutenções...</span>
                </div>
              </td>
            </tr>
          ) : maintenances.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-8 text-gray-500">
                Nenhuma manutenção registrada.
              </td>
            </tr>
          ) : (
            maintenances.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  {new Date(item.createdAt).toLocaleDateString('pt-BR')} {' '}
                </td>
                <td className="px-4 py-3">
                  {item.finishedAt ? new Date(item.finishedAt).toLocaleDateString('pt-BR') : 'Em Andamento'}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {item.technician}
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => onViewDetails(item.id)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Ver Detalhes"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Rodapé de Paginação */}
      <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between bg-gray-50 rounded-b-lg">
        <span className="text-sm text-gray-600">
          Página <span className="font-semibold text-gray-900">{currentPage}</span> de <span className="font-semibold text-gray-900">{totalPages || 1}</span>
        </span>
        
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="px-3 py-1 border border-gray-300 rounded-md bg-white text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Anterior
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            className="px-3 py-1 border border-gray-300 rounded-md bg-white text-xs font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  )
}