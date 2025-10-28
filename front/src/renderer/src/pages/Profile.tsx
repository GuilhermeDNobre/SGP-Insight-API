import Sidebar from '@renderer/components/Sidebar'
import React from 'react'

function Profile(): React.JSX.Element {
  return (
    <div className="w-screen h-screen bg-[var(--sec)] flex justify-center items-center relative">
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Conteúdo central da página */}
      <div className="z-10 text-white text-3xl font-bold">Página de Perfil</div>
    </div>
  )
}

export default Profile
