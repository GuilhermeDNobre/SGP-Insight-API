import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import Snackbar, { SnackbarType } from '@components/Snackbar'

interface SnackbarContextType {
  showSnackbar: (message: string, type: SnackbarType) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined)

// --- Provider ---
interface SnackbarProviderProps {
  children: React.ReactNode;
}

export function SnackbarProvider({ children }: SnackbarProviderProps): React.JSX.Element {
  const [message, setMessage] = useState('')
  const [type, setType] = useState<SnackbarType>('info')
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const showSnackbar = useCallback((newMessage: string, newType: SnackbarType) => {
    // Limpa o timeout anterior para evitar conflitos
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    setMessage(newMessage)
    setType(newType)
    setIsVisible(true)

    // Esconde a snackbar após 4 segundos
    const id = setTimeout(() => {
      setIsVisible(false)
      // Limpa a mensagem após a transição para evitar que o conteúdo seja renderizado
      // enquanto o elemento está invisível
      setTimeout(() => setMessage(''), 300) 
    }, 4000)
    
    setTimeoutId(id)
  }, [timeoutId])

  const hideSnackbar = useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
    setTimeout(() => setMessage(''), 300)
  }, [timeoutId])

  const contextValue = useMemo(() => ({ showSnackbar }), [showSnackbar])

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar 
        message={message} 
        type={type} 
        onClose={hideSnackbar} 
        isVisible={isVisible} 
      />
    </SnackbarContext.Provider>
  )
}

// --- Hook de uso ---
// eslint-disable-next-line react-refresh/only-export-components
export function useSnackbar(): SnackbarContextType {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context
}