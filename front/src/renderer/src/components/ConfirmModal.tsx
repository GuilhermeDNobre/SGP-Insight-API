import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import Button from './Button'

type ConfirmVariant = 'danger' | 'primary' | 'success' | 'warning'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
  variant?: ConfirmVariant 
  confirmText?: string
  cancelText?: string
  closeOnOverlayClick?: boolean
}

const variantStyles = {
  danger: {
    btnClass: '!bg-[var(--erro)] text-white hover:bg-red-700 !border-transparent',
    defaultText: 'Excluir'
  },
  primary: {
    btnClass: '!bg-blue-600 text-white hover:bg-blue-700 !border-transparent',
    defaultText: 'Confirmar'
  },
  success: {
    btnClass: '!bg-[var(--sucess)] text-white hover:bg-green-700 border-transparent',
    defaultText: 'Salvar'
  },
  warning: {
    btnClass: 'bg-[var(--warning)] text-white hover:bg-yellow-600 !border-transparent',
    defaultText: 'Continuar'
  }
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'danger',
  confirmText,
  cancelText = 'Cancelar',
  closeOnOverlayClick = true
}: ConfirmModalProps): React.JSX.Element | null {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  // Configuração do Portal (igual ao Snackbar)
  useEffect(() => {
    let element = document.getElementById('modal-root')
    if (!element) {
      element = document.createElement('div')
      element.id = 'modal-root'
      // Z-index maior que o Snackbar para garantir que o modal trave a tela
      element.style.position = 'relative' 
      element.style.zIndex = '10000' 
      document.body.appendChild(element)
    }
    setPortalRoot(element)
  }, [])

  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isOpen) onCancel()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onCancel])

  if (!isOpen || !portalRoot) return null

  const { btnClass, defaultText } = variantStyles[variant]
  const finalConfirmText = confirmText || defaultText

  const handleOverlayClick = (): void => {
    if (closeOnOverlayClick && !isLoading) {
      onCancel()
    }
  }

  const modalContent = (
    <div 
      className="fixed inset-0 z-10000 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={handleOverlayClick}>
      {/* Container do Modal */}
      <div 
        className="w-full max-w-md transform rounded-lg bg-white p-6 shadow-2xl transition-all scale-100"
        role="dialog"
        aria-modal="true"
      >
        <button 
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors rounded p-1 hover:bg-gray-100"
          aria-label="Fechar modal"
        >
          <X size={24} />
        </button>

        <h3 className="text-lg font-bold text-gray-900 pb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed pb-3">{message}</p>
        
        <div className="flex justify-end gap-3">
          <Button 
            label={cancelText} 
            variant="ghost" 
            onClick={onCancel}
            disabled={isLoading}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border-gray-200"
          />
          <Button 
            label={isLoading ? 'Processando...' : finalConfirmText} 
            variant="primary" // O componente Button usa variants proprias, então passamos styles via className
            onClick={onConfirm}
            disabled={isLoading}
            className={`${btnClass} min-w-[100px]`}
          />
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, portalRoot)
}