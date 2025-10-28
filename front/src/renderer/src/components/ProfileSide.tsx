import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function ProfileSide(): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string): boolean => location.pathname === path

  return (
    <aside className="hidden md:block w-full md:w-80 lg:w-96 shrink-0 h-full border-r border-(--light-gray) pr-4 md:pr-8">
      <nav className="flex flex-col gap-3 md:gap-5 pt-3 md:pt-5">
        <button
          onClick={() => navigate('/profile-edit')}
          className={`text-base md:text-lg text-(--black) font-semibold text-left p-2 rounded-md transition-colors
            ${
              isActive('/profile-edit')
                ? 'bg-(--gray-light) text-(--black) shadow-sm'
                : 'text-(--black) hover:bg-(--gray-light)/50'
            }`}
        >
          Editar informações de usuário
        </button>

        <button
          onClick={() => {
            navigate('/profile-delete')
          }}
          className={`text-base md:text-lg font-semibold text-left p-2 rounded-md transition-colors
            ${
              isActive('/profile-delete')
                ? 'bg-(--erro)/25 text-(--erro) shadow-sm'
                : 'text-(--erro) hover:bg-(--erro)/10'
            }`}
        >
          Excluir usuário
        </button>
      </nav>
    </aside>
  )
}
