import React, { useState, useEffect } from "react"
import Button from '@components/Button'
import { X } from "lucide-react"

export interface AlertFilters {
    trimestre?: number
    occurrenceCount?: number
    startDate?: string
    endDate?: string
}

interface AlertModalProps {
    isOpen: boolean
    onClose: () => void
    onApply: (filters: AlertFilters) => void
    initialFilters: AlertFilters
}

export default function AlertModal({ isOpen, onClose, onApply, initialFilters }: AlertModalProps): React.JSX.Element | null {
    const [trimestre, setTrimestre] = useState('')
    const [ocorrencias, setOcorrencias] = useState('')
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')

    const resetInternalForm = (): void => {
        setTrimestre('')
        setOcorrencias('')
        setDataInicio('')
        setDataFim('')
    }

    // Resetar estados quando o modal abre
    useEffect(() => {
        if (isOpen) {
            setTrimestre(initialFilters.trimestre ? String(initialFilters.trimestre) : '')
            setOcorrencias(initialFilters.occurrenceCount ? String(initialFilters.occurrenceCount) : '')
            setDataInicio(initialFilters.startDate || '')
            setDataFim(initialFilters.endDate || '')
        } else {
            resetInternalForm()
        } 
    }, [isOpen, initialFilters ])

    const handleClear = (): void => {
        resetInternalForm()
        onApply({}) 
        onClose()
    }

    const handleConfirm = (): void => {
        const filters: AlertFilters = {
            trimestre: trimestre ? Number(trimestre) : undefined,
            occurrenceCount: ocorrencias ? Number(ocorrencias) : undefined,
            startDate: dataInicio || undefined,
            endDate: dataFim || undefined
        }

        console.log("Aplicando filtros:", filters)
        onApply(filters)
        onClose()
    }

    if (!isOpen) return null

    return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md flex flex-col gap-4 relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800">Filtrar Alertas</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
            <X size={24} />
          </button>
        </div>

        {/* Formulário */}
        <div className="flex flex-col gap-4">
          
          {/* Campo Trimestre */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Trimestre:</label>
            <select 
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={trimestre}
              onChange={(e) => setTrimestre(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="1">1º Trimestre</option>
              <option value="2">2º Trimestre</option>
              <option value="3">3º Trimestre</option>
              <option value="4">4º Trimestre</option>
            </select>
          </div>

          {/* Campo Número de Ocorrências */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Mínimo de Ocorrências:</label>
            <input 
              type="number" 
              placeholder="Ex: 2"
              min="0"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={ocorrencias}
              onChange={(e) => setOcorrencias(e.target.value)}
            />
          </div>

          {/* Campos de Data */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Período da Última Ocorrência:</label>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-gray-500">De</span>
                <input 
                  type="date" 
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-gray-500">Até</span>
                <input 
                  type="date" 
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Rodapé */}
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
          <Button 
            label="Limpar" 
            variant="danger" 
            onClick={handleClear} 
            className="text-sm px-4"
          />
          <Button 
            label="Aplicar Filtros" 
            variant="primary"
            onClick={handleConfirm} 
            className="text-sm px-4"
          />
        </div>

      </div>
    </div>
  )
}