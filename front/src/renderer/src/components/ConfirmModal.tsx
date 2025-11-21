import React from 'react'
import Button from './Button'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false
}: ConfirmModalProps): React.JSX.Element | null {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Container do Modal */}
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-2 text-lg font-bold text-gray-900">{title}</h3>
        <p className="mb-6 text-gray-600">{message}</p>
        
        <div className="flex justify-end gap-3">
          <Button 
            label="Cancelar" 
            variant="secondary" 
            onClick={onCancel}
            disabled={isLoading}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
          />
          <Button 
            label={isLoading ? 'Processando...' : 'Confirmar'} 
            variant="primary" 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700"
          />
        </div>
      </div>
    </div>
  )
}