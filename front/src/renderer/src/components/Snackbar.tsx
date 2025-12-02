import React from 'react'
import { CheckCircle, XCircle, Info, X, AlertTriangle } from 'lucide-react'

export type SnackbarType = 'success' | 'error' | 'info' | 'warning'

interface SnackbarProps {
  message: string;
  type: SnackbarType;
  onClose: () => void;
  isVisible: boolean;
}

const typeMap = {
  success: { 
    icon: CheckCircle, 
    color: 'bg-[var(--sucess)]', 
    title: 'Sucesso',
    iconColor: 'text-green-200'
  },
  error: { 
    icon: XCircle, 
    color: 'bg-[var(--erro)]', 
    title: 'Erro',
    iconColor: 'text-red-200'
  },
  info: { 
    icon: Info, 
    color: 'bg-blue-500', 
    title: 'Informação',
    iconColor: 'text-blue-200'
  },
  warning: { 
    icon: AlertTriangle,
    color: 'bg-yellow-500', 
    title: 'Atenção',
    iconColor: 'text-yellow-200'
  }
} as const;

export default function Snackbar({ message, type, onClose, isVisible }: SnackbarProps): React.JSX.Element | null {
  const { icon: Icon, color, title, iconColor } = typeMap[type]

  // Classes de transição para animação
  const baseClasses = `fixed bottom-6 right-6 p-4 rounded-lg shadow-2xl transition-all duration-300 transform max-w-sm w-full z-[9999] text-white ${color}`
  const visibilityClasses = isVisible 
    ? 'translate-y-0 opacity-100' 
    : 'translate-y-20 opacity-0 pointer-events-none'

  if (!isVisible && !message) return null // Não renderiza se não for visível e não tiver mensagem

  return (
    <div className={`${baseClasses} ${visibilityClasses}`}>
      <div className="flex items-start justify-between">
        {/* Ícone e Mensagem */}
        <div className="flex items-start gap-3">
          <Icon size={24} className={`shrink-0 ${iconColor}`} />
          <div>
            <h4 className="font-bold text-sm">{title}</h4>
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
        
        {/* Botão Fechar */}
        <button 
          onClick={onClose} 
          className="p-1 rounded-full hover:bg-white/10 transition-colors shrink-0 -mt-1"
          aria-label="Fechar Notificação"
        >
          <X size={18} className="text-white" />
        </button>
      </div>
    </div>
  )
}