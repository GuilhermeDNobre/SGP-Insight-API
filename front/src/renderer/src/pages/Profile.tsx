import Sidebar from '@renderer/components/Sidebar'
import React from 'react'
import ProfileAvatar from '@assets/icons/logo.svg'
import { FaPencilAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function Profile(): React.JSX.Element {
  const navigate = useNavigate()

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
              <h2 className="text-3xl font-bold">
                Fernando Silva
                </h2>
                <FaPencilAlt
                  className="text-gray-400 hover:text-gray-500 cursor-pointer"
                  size={14}
                  onClick={() => navigate('/profile-edit')}
                />
                </div>
                <p className="text-gray-500 mt-1 mb-8">
                  Assistente Técnico
                </p>
            </div>

          <div className="w-full">
            <div className="mb-8">
              <div className="flex items-baseline scpace-x-2">
                <span className="text-lg font-bold text-black">Email: </span>
                <span className="text-base text-gray-800"> email@example.com</span>
              </div>
              </div>

            <div className="mb-8">
              <div className="flex items-baseline scpace-x-2">
                <span className="text-lg font-bold text-black">CNPJ: </span>
                <span className="text-base text-gray-800"> XX.XXX.XXX/0000-XX</span>
              </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-black">Equipamentos</h3>
              </div>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-black">Manutenções</h3>
              </div>
            </div>
        </div>
      </main>
    </div>
  )
}

export default Profile