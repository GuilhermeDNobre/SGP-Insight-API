import Sidebar from '@components/Sidebar'
import { useProfile } from '@hooks/useProfile'
import Input from '@renderer/components/Input'
import { X } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DeleteProfile(): React.JSX.Element {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  const { deleteProfile, isLoading } = useProfile()

  const handleConfirmDelete = async (): Promise<void> => {
    try {
      await deleteProfile()
      setIsModalOpen(false)
      alert('Perfil excluído com sucesso!')
      navigate('/login')
    } catch (err) {
      console.error('Erro ao excluir:', err)
      alert(err instanceof Error ? err.message : 'Erro ao excluir perfil')
    }
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (password.trim() === '') {
      setError('Por favor, insira sua senha para confirmar.')
    } else {
      setError('')
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <div className="flex h-screen bg-white">
        <Sidebar />

        <main className="flex-1 flex pt-28 pb-10 px-4 gap-10">
          <div className="w-full max-w-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8">Excluir Perfil de Usuário</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex-1">
                <Input
                  label="Insira sua senha"
                  type="password"
                  placeholder="Senha atual"
                  labelVariant="default"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (error) setError('')
                  }}
                  error={error}
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  className="flex-1 px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {isLoading ? 'Excluindo...' : 'Excluir Perfil'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
            >
              <X size={24} />
            </button>

            <h3 className="text-xl font-medium text-gray-800">Excluir Perfil de Usuário?</h3>

            <p className="mt-4 text-base text-gray-600">
              Tem certeza de que deseja excluir seu perfil?
              <span className="font-bold text-red-600"> Esta ação é irreversível.</span>
            </p>

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition"
              >
                {isLoading ? 'Excluindo...' : 'Sim, Excluir Perfil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
