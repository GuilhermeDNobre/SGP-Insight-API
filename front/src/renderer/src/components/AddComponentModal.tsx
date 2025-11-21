import React, { useState } from 'react'
import Button from './Button'
import Input from './Input'
import { X } from 'lucide-react'

interface AddComponentModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: { type: string; model: string }) => void
}

export default function AddComponentModal({
  isOpen,
  onClose,
  onAdd
}: AddComponentModalProps): React.JSX.Element | null {
  const [type, setType] = useState('')
  const [model, setModel] = useState('')
  const [error, setError] = useState('')

  // Não renderiza nada se estiver fechado
  if (!isOpen) {
    return null
  }

  // Ação do <Button>
  const handleSubmit = (): void => {
    if (!type.trim() || !model.trim()) {
      setError('Preencha todos os campos.')
      return
    }
    
    // CORREÇÃO AQUI: Enviando as chaves corretas em inglês
    onAdd({ type, model })
    
    // Limpa o formulário
    setType('')
    setModel('')
    setError('')
    onClose()
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        
        <h3 className="mb-4 text-lg font-bold text-gray-900">Adicionar Componente</h3>
        
        <div className="flex flex-col gap-4">
          <Input
            label="Tipo de Componente"
            placeholder="Ex: Memória RAM"
            value={type}
            onChange={(e) => setType(e.target.value)}
            labelVariant="default"
          />
          <Input
            label="Modelo"
            placeholder="Ex: Kingston Fury 8GB"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            labelVariant="default"
          />
          
          {error && <span className="text-sm text-red-500">{error}</span>}

          <div className="flex justify-end gap-3 mt-2">
            <Button label="Cancelar" variant="secondary" onClick={onClose} />
            <Button label="Adicionar" variant="primary" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  )
}
