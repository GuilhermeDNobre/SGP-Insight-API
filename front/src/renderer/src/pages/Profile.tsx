import ProfileAvatar from '@assets/icons/logo.svg'
import { useProfile } from '@hooks/useProfile'
import Sidebar from '@renderer/components/Sidebar'
import React, { useEffect } from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function Profile(): React.JSX.Element {
  const navigate = useNavigate()
  const { userData, isLoading, loadUserData } = useProfile()

  useEffect(() => {
    console.log('[Profile Page] Montando componente')
    loadUserData()
  }, [])

  useEffect(() => {
    console.log('[Profile Page] userData mudou:', userData)
  }, [userData])

  if (isLoading) {
    return (
      <div className="flex w-screen h-screen bg-white">
        <Sidebar />
        <main className="flex-grow flex justify-center items-center">
          <p className="text-gray-500">Carregando...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex w-screen h-screen bg-white">
      <Sidebar />

      <main className="flex-grow flex justify-center items-center p-8 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg text-gray-800">
          <div className="flex flex-col items-center">
            <img
              src={ProfileAvatar}
              alt="Foto de Perfil"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
            />
            <div className="flex items-center space-x-3">
              <h2 className="text-3xl font-bold">{userData?.firstName || 'Usuário'}</h2>
              <FaPencilAlt
                className="text-gray-400 hover:text-gray-500 cursor-pointer"
                size={14}
                onClick={() => navigate('/profile-edit')}
              />
            </div>
            <p className="text-gray-500 mt-1 mb-8">
              {userData?.role === 'ADMIN' ? 'Administrador' : 'Gerente'}
            </p>
          </div>

          <div className="w-full">
            <div className="mb-8">
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-bold text-black">Email: </span>
                <span className="text-base text-gray-800">{userData?.email}</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-bold text-black">ID: </span>
                <span className="text-base text-gray-800 truncate">{userData?.id}</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-black">Ações</h3>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => {
                    console.log('[Profile] Clicou em Editar Perfil')
                    navigate('/profile-edit')
                  }}
                  className="px-4 py-2 bg-(--ter) text-white rounded-md hover:bg-(--ter)/50 transition"
                >
                  Editar Perfil
                </button>
                <button
                  onClick={() => {
                    console.log('[Profile] Clicou em Excluir Perfil')
                    navigate('/profile-delete')
                  }}
                  className="px-4 py-2 bg-(--erro) text-white rounded-md hover:bg-red-400 transition"
                >
                  Excluir Perfil
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
