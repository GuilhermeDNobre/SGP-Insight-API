import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function ProfileSide(): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string): boolean => location.pathname === path

  return (
    <div className="max-w-80 mx-auto h-full border-r border-(--light-gray) pr-8">
      <div className="flex flex-col gap-5 pt-5">
        <button
          onClick={() => navigate('/profile-edit')}
          className={`text-lg font-semibold text-left p-2 rounded-md transition-colors
            ${
              isActive('/profile-edit')
                ? 'bg-(--gray-light) text-(--black)'
                : 'text-(--black) hover:bg-(--gray-light)/50'
            }`}
        >
          Editar informações de usuário
        </button>

        <button
          onClick={() => {
            navigate('/profile-delete')
          }}
          className={`text-lg font-semibold text-left p-2 rounded-md transition-colors
            ${
              isActive('/profile-delete')
                ? 'bg-(--erro)/25 text-(--erro)'
                : 'text-(--black) hover:bg-(--erro)/50'
            }`}
        >
          Excluir usuário
        </button>
      </div>
    </div>
  )
}
