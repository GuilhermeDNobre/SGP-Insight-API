import React from 'react'
import { EquipmentMove } from '../types/equipment_move'

interface MovementsTableProps {
  movements: EquipmentMove[]
  isLoading: boolean
  showEquipmentColumn?: boolean
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export default function MovementsTable ({ 
  movements, 
  isLoading, 
  showEquipmentColumn = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange
}: MovementsTableProps): React.JSX.Element {
  
  if (isLoading) {
    return <div className="py-8 text-center text-gray-500">Carregando histórico...</div>
  }

  if (movements.length === 0) {
    return <div className="py-8 text-center text-gray-500">Nenhuma movimentação registrada.</div>
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-100 font-semibold text-gray-700">
          <tr>
            <th className="px-4 py-3">Data</th>
            {/* Coluna condicional */}
            {showEquipmentColumn && <th className="px-4 py-3">Equipamento</th>}
            <th className="px-4 py-3">Origem</th>
            <th className="px-4 py-3">Destino</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {movements.map((move) => (
            <tr key={move.id} className="hover:bg-gray-50">
              {/* Data Formatada */}
              <td className="px-4 py-3">
                {new Date(move.createdAt).toLocaleDateString('pt-BR')} {' '}
                <span className="text-xs text-gray-400">
                  {new Date(move.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </td>
              
              {/* Equipamento (Só aparece no Depto) */}
              {showEquipmentColumn && (
                <td className="px-4 py-3 font-medium text-gray-900">
                  {move.equipment.name}
                </td>
              )}

              {/* Origem */}
              <td className="px-4 py-3 text-gray-500">
                {move.previouslyAlocatedAt?.name || '-'}
              </td>

              {/* Destino */}
              <td className="px-4 py-3 text-gray-900 font-medium">
                {move.newlyAlocatedAt.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {onPageChange && totalPages >= 1 && (
        <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-between bg-gray-50 rounded-b-lg">
          <span className="text-sm text-gray-600">
            Página <span className="font-semibold text-gray-900">{currentPage}</span> de <span className="font-semibold text-gray-900">{totalPages}</span>
          </span>
          
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded bg-white text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Anterior
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded bg-white text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}