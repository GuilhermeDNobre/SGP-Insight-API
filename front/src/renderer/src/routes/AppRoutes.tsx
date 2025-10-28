import Home from '@pages/Home'
import Login from '@pages/Login'
import Profile from '@pages/Profile'
import Tools from '@pages/Tools'
import Alerts from '@renderer/pages/Alerts'
import Maintenance from '@renderer/pages/Maintenance'
import { Route, Routes } from 'react-router-dom'

export default function AppRoutes(): React.JSX.Element {
  return (
    <Routes>
      {/* Login e rota padrão */}
      <Route path="/" element={<Login />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/alerts" element={<Alerts />} />
    </Routes>
  )
}
