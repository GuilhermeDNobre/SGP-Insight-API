import AddTool from '@pages/AddTool'
import Alerts from '@pages/Alerts'
import CreateDepartment from '@pages/CreateDepartment'
import CreateEquipment from '@pages/CreateEquipment'
import DeleteProfile from '@pages/DeleteProfile'
import Departments from '@pages/Departments'
import EditDepartment from '@pages/EditDepartment'
import EditEquipment from '@pages/EditEquipment'
import EditProfile from '@pages/EditProfile'
import Equipment from '@pages/Equipment'
import EquipmentDetails from '@pages/EquipmentView'
import Home from '@pages/Home'
import Login from '@pages/Login'
import Maintenance from '@pages/Maintenance'
import Profile from '@pages/Profile'
import Register from '@pages/Register'
import CreateUser from '@renderer/pages/CreateUser'
import ListUsers from '@renderer/pages/ListUsers'
import { Route, Routes } from 'react-router-dom'

export default function AppRoutes(): React.JSX.Element {
  return (
    <Routes>
      {/* Login e rota padrão */}
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/addTool" element={<AddTool />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/alerts" element={<Alerts />} />

      {/* Equipamentos */}
      <Route path="/equipments" element={<Equipment />} />
      <Route path="/equipment-create" element={<CreateEquipment />} />
      <Route path="/equipment-edit/:id" element={<EditEquipment />} />
      <Route path="/equipment-details/:id" element={<EquipmentDetails />} />

      {/* Departamentos */}
      <Route path="/departments" element={<Departments />} />
      <Route path="/department-create" element={<CreateDepartment />} />
      <Route path="/department-edit/:id" element={<EditDepartment />} />

      {/* Perfil e Usuários */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile-edit" element={<EditProfile />} />
      <Route path="/profile-delete" element={<DeleteProfile />} />
      <Route path="/list-users" element={<ListUsers />} />
      <Route path="/user-create" element={<CreateUser />} />
    </Routes>
  )
}
