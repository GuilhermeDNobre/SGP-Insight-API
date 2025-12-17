import { useProfile } from '@hooks/useProfile'
import Sidebar from '@renderer/components/Sidebar'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Profile(): React.JSX.Element {
  const navigate = useNavigate()
  const { userData, isLoading, loadUserData } = useProfile()

  useEffect(() => {
    loadUserData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex w-screen h-screen bg-white">
        <Sidebar />
        <main className="grow flex flex-col justify-center items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Carregando seu perfil…</p>
        </main>
      </div>
    )
  }

  const initials = userData?.firstName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex w-screen h-screen bg-white">
      <Sidebar />

      <main className="grow flex flex-col items-center p-8 overflow-y-auto gap-6">
        {/* Card do Perfil */}
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg text-gray-800">
          {/* Cabeçalho */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
              {initials || 'U'}
            </div>

            <h2 className="text-2xl font-bold">{userData?.firstName || 'Usuário'}</h2>

            <span className="text-sm text-gray-500">
              {userData?.role === 'ADMIN' ? 'Administrador' : 'Gerente'}
            </span>
          </div>

          {/* Informações */}
          <div className="space-y-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
              <p className="text-base font-medium text-gray-800">{userData?.email}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">ID do usuário</p>
              <p className="text-sm text-gray-600 truncate font-mono">{userData?.id}</p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex w-full max-w-lg justify-between gap-4">
          <button
            onClick={() => navigate('/profile-edit')}
            className="w-full px-4 py-2 bg-(--ter) text-white rounded-md hover:opacity-90 transition"
          >
            Editar Perfil
          </button>

          {userData?.role !== 'ADMIN' && (
            <button
              onClick={() => navigate('/profile-delete')}
              className="w-full px-4 py-2 bg-(--erro) text-white rounded-md hover:opacity-90 transition"
            >
              Excluir Perfil
            </button>
          )}

          {userData?.role === 'ADMIN' && (
            <button
              onClick={() => navigate('/list-users')}
              className="w-full px-4 py-2 bg-(--sec) text-white rounded-md hover:bg-(--ter) transition"
            >
              Gerenciar Usuários
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

export default Profile
