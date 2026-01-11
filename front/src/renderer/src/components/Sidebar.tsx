import Logo from '@assets/icons/Logo.svg'
import {
  Building2,
  ChevronsLeft,
  Home,
  LogOut,
  Menu,
  MonitorCog,
  TriangleAlert,
  User,
  Wrench
} from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ConfirmModal from '@components/ConfirmModal'

export default function Sidebar(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const [isExitModalOpen, setIsExitModalOpen] = useState(false)
  const handleConfirmExit = (): void => {
    setIsExitModalOpen(false)
    navigate('/') // volta para a tela de login
  }

  const isCurrentPath = (path: string): boolean => {
    // Ajuste fino para a Home não ficar ativa em outras rotas se a home for apenas "/"
    if (path === '/Home' && location.pathname === '/Home') return true
    
    // Para as outras rotas, verifica se o caminho atual começa com o caminho do item
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Botão de abrir menu */}
      <div className="fixed top-2 left-2 p-2 rounded-md transition transform hover:scale-95 z-30">
        <SidebarItem 
          icon={<Menu size={20} />} 
          label="Menu" 
          onClick={() => setIsOpen(true)} 
          className="text-(--pri)! hover:bg-gray-200"
        />
      </div>

      {/* Overlay escurecido */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/15 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`flex flex-col fixed top-0 left-0 h-full w-64 z-50 bg-(--pri) text-white transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Cabeçalho */}
        <div className="flex flex-col justify-between items-center p-4 gap-5 border-b border-white/20">
          <button
            onClick={() => setIsOpen(false)}
            className="self-start hover:opacity-80 transition cursor-pointer transform hover:scale-95"
          >
            <ChevronsLeft size={30} />
          </button>
          <img src={Logo} alt="Logo SGP" className="w-50" />
          <SidebarItem
            icon={<User size={25} />}
            label="Meu Perfil"
            isActive={isCurrentPath('/profile')}
            onClick={() => {
              navigate('/profile')
            }}
          />
        </div>

        {/* Navegação */}
        <nav className="flex-1 p-4">
          <SidebarItem
            icon={<Home size={25} />}
            label="Início"
            isActive={isCurrentPath('/Home')}
            onClick={() => {
              navigate('/Home')
            }}
          />
          <SidebarItem
            icon={<MonitorCog size={25} />}
            label="Equipamentos"
            isActive={isCurrentPath('/equipments')}
            onClick={() => {
              navigate('/equipments')
            }}
          />
          <SidebarItem
            icon={<Building2 size={25} />}
            label="Departamentos"
            isActive={isCurrentPath('/departments')}
            onClick={() => {
              navigate('/departments')
            }}
          />
          <SidebarItem
            icon={<Wrench size={25} />}
            label="Manutenções"
            isActive={isCurrentPath('/maintenance')}
            onClick={() => {
              navigate('/maintenance')
            }}
          />
          <SidebarItem
            icon={<TriangleAlert size={25} />}
            label="Alertas"
            isActive={isCurrentPath('/alerts')}
            onClick={() => {
              setIsOpen(true)
              navigate('/alerts')
            }}
          />
        </nav>

        {/* Sair */}
        <div className="p-4 border-t border-white/25 text-red-400">
          <SidebarItem
            icon={<LogOut size={25} />}
            label="Sair"
            className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
            onClick={() => {
              setIsExitModalOpen(true)
            }}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={isExitModalOpen}
        title="Confirmar Saída"
        message="Tem certeza que deseja sair do sistema?"
        onConfirm={handleConfirmExit}
        onCancel={() => setIsExitModalOpen(false)}
        variant="danger"
        confirmText="Sair"
      />
    </>
  )
}

function SidebarItem({
  icon,
  label,
  onClick,
  isActive = false,
  className = ''
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  isActive?: boolean
  className?: string
}): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center w-full text-left gap-3 px-4 py-2 rounded-md transition-all duration-200 cursor-pointer
        ${isActive 
            ? 'bg-white text-(--pri) font-bold shadow-md ' // Estilo Ativo: Fundo Branco, Texto Cor Primária
            : 'text-white hover:bg-white/10' // Estilo Inativo
        }
        ${className} 
      `}
    >
      {/* O ícone herda a cor do texto automaticamente */}
      {icon}
      <span>{label}</span>
    </button>
  )
}
