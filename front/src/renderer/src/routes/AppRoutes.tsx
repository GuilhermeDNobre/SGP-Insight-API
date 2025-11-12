import AddTool from '@pages/AddTool'
import Alerts from '@pages/Alerts'
import DeleteProfile from '@pages/DeleteProfile'
import EditProfile from '@pages/EditProfile'
import Home from '@pages/Home'
import Login from '@pages/Login'
import Maintenance from '@pages/Maintenance'
import Profile from '@pages/Profile'
import Register from '@pages/Register'
import Tools from '@pages/Tools'
import { Route, Routes } from 'react-router-dom'

export default function AppRoutes(): React.JSX.Element {
  return (
    <Routes>
      {/* Login e rota padrão */}
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile-edit" element={<EditProfile />} />
      <Route path="/profile-delete" element={<DeleteProfile />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/addTool" element={<AddTool />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/alerts" element={<Alerts />} />
    </Routes>
  )
}
