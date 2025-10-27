import Login from '@pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

export default function AppRoutes(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login e rota padrão */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
