import React, { useState, useEffect } from 'react'
import Button from './Button'
import { X } from 'lucide-react'

export interface MaintenanceFilterValues {
  status?: string
  openDate?: string
  closeDate?: string
}

interface MaintenanceFilterModalProps {
  isOpen: boolean
  onClose: () => void
  currentFilters: MaintenanceFilterValues
  onApply: (filters: MaintenanceFilterValues) => void
  onClear: () => void
}

function StatusCheckbox({
  label, 
  colorClass,
  checked,
  onChange 
}: {
  label: string,
  colorClass: string,
  checked: boolean,
  onChange: () => void
} ): React.JSX.Element {
    return (
        <label className="flex items-center gap-2 cursor-pointer select-none hover:bg-gray-50 p-1 rounded transition-colors">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={checked} onChange={onChange} />
            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${colorClass} bg-opacity-20 border border-opacity-20`}>{label}</span>
        </label>
    )
}

export default function MaintenanceFilterModal({ 
    isOpen, onClose, currentFilters, onApply, onClear
}: MaintenanceFilterModalProps): React.JSX.Element | null {
    
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
    
    // Agora são apenas duas variáveis simples
    const [openDate, setOpenDate] = useState('')
    const [closeDate, setCloseDate] = useState('')

    useEffect(() => {
        if (isOpen) {
            if (currentFilters.status) {
                setSelectedStatuses(currentFilters.status.split(','))
            } else {
                setSelectedStatuses([])
            }
            setOpenDate(currentFilters.openDate || '')
            setCloseDate(currentFilters.closeDate || '')
        }
    }, [isOpen, currentFilters])

    if (!isOpen) return null

    const handleStatusChange = (status: string): void => {
        if (selectedStatuses.includes(status)) {
            setSelectedStatuses(prev => prev.filter(s => s !== status))
        } else {
            setSelectedStatuses(prev => [...prev, status])
        }
    }

    const handleClearFilters = (): void => {
        setSelectedStatuses([])
        setOpenDate('')
        setCloseDate('')
        onClear()
        onClose()
    }

    const handleConfirmFilters = (): void => {
        onApply({
            status: selectedStatuses.length > 0 ? selectedStatuses.join(',') : undefined,
            openDate: openDate || undefined,
            closeDate: closeDate || undefined,
        })
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800">Filtrar Manutenções</h3> 
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><X size={24} /></button>
                </div>

                {/* Filtro de Status */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Por Status:</h4>
                    <div className="flex flex-row gap-4">
                        <StatusCheckbox label="Aberta" colorClass="text-blue-800 bg-blue-100 border-blue-200 flex-1" checked={selectedStatuses.includes('ABERTA')} onChange={() => handleStatusChange('ABERTA')} />
                        <StatusCheckbox label="Terminada" colorClass="text-green-800 bg-green-100 border-green-200 flex-1" checked={selectedStatuses.includes('TERMINADA')} onChange={() => handleStatusChange('TERMINADA')} />
                    </div>
                </div>

                {/* Filtro de Datas (Lado a Lado) */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Data Abertura:</h4>
                        <input 
                            type="date" 
                            value={openDate}
                            onChange={e => setOpenDate(e.target.value)}
                            className="w-full text-sm border-gray-300 rounded-md border px-2 py-1.5 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Data Conclusão:</h4>
                        <input 
                            type="date" 
                            value={closeDate}
                            onChange={e => setCloseDate(e.target.value)}
                            className="w-full text-sm border-gray-300 rounded-md border px-2 py-1.5 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Rodapé */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button label="Limpar" variant="danger" onClick={handleClearFilters} className="text-sm px-4" />
                    <Button label="Aplicar" variant="primary" onClick={handleConfirmFilters} className="text-sm px-4" />
                </div>
            </div>
        </div>
    )
}