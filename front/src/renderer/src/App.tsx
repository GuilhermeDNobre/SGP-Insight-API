import AppRoutes from '@routes/AppRoutes'
import { SnackbarProvider } from './context/SnackbarContext'
import React from 'react'

function App(): React.JSX.Element {
  return (
    <SnackbarProvider>
      <AppRoutes />
    </SnackbarProvider>
  )
}

export default App
