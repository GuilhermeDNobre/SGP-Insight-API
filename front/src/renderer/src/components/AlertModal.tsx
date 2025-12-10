import React, { useState } from "react"
import Button from '@components/Button'
import { X } from "lucide-react"

interface AlertModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function AlertModal({ isOpen, onClose }: AlertModalProps): React.JSX.Element | null {
    if (!isOpen) return null

    const [trimestre, setTrimestre] = useState('')
    const [ocorrencias, setOcorrencias] = useState('')
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')

    const handleClear = (): void => {
        setTrimestre('')
        setOcorrencias('')
        setDataInicio('')
        setDataFim('')
    }

    const handleConfirm = (): void => {
        console.log({ trimestre, ocorrencias, dataInicio, dataFim })
        onClose()
    }

    return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md flex flex-col gap-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-[var(--txt)]">Filtrar Alertas</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Formulário */}
        <div className="flex flex-col gap-4">
          
          {/* Campo Trimestre */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--txt)]">Trimestre:</label>
            <select 
              className="w-full rounded-md border border-[var(--gray-light)] bg-white px-3 py-2 text-sm text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--pri)]"
              value={trimestre}
              onChange={(e) => setTrimestre(e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="1">1º Trimestre</option>
              <option value="2">2º Trimestre</option>
              <option value="3">3º Trimestre</option>
              <option value="4">4º Trimestre</option>
            </select>
          </div>

          {/* Campo Número de Ocorrências */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--txt)]">Número de Ocorrências:</label>
            <input 
              type="number" 
              placeholder="Nº de Ocorrências"
              className="w-full rounded-md border border-[var(--gray-light)] bg-white px-3 py-2 text-sm text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--pri)]"
              value={ocorrencias}
              onChange={(e) => setOcorrencias(e.target.value)}
            />
          </div>

          {/* Campos de Data */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--txt)]">Período da Última Ocorrência:</label>
            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2 w-full">
                <span className="text-sm text-gray-500">De</span>
                <input 
                  type="date" 
                  className="w-full rounded-md border border-[var(--gray-light)] bg-white px-3 py-2 text-sm text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--pri)]"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full">
                <span className="text-sm text-gray-500">até</span>
                <input 
                  type="date" 
                  className="w-full rounded-md border border-[var(--gray-light)] bg-white px-3 py-2 text-sm text-[var(--txt)] focus:outline-none focus:ring-2 focus:ring-[var(--pri)]"
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
            label="Limpar Filtros" 
            variant="danger" 
            onClick={handleClear} 
          />
          <Button 
            label="Confirmar Filtragem" 
            variant="success" 
            onClick={handleConfirm} 
          />
        </div>

      </div>
    </div>
  )
}