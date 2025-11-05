import ProfileSide from '@components/ProfileSide'
import Sidebar from '@components/Sidebar'
import React, { useState } from 'react'
import Input from '@renderer/components/Input'
import Button from '@renderer/components/Button'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'

export default function DeleteProfile(): React.JSX.Element {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleConfirmDelete = (): void => {
    console.log('Excluindo com senha:', password)
    setIsModalOpen(false)
    alert('Perfil excluído com sucesso!')
    navigate('/login')
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
        <ProfileSide />

        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-[var(--txt-var)] mb-8">
            Excluir Perfil de Usuário
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            <div className="flex-1">
            <Input
              label="Insira sua senha:"
              type="password"
              placeholder="Senha atual"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError('')
              }}
            />
            </div>

            <div className="flex justify-end mt-6">
              <Button
              label="Excluir Perfil"
              type="submit"
              variant="danger"
            />
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
          onClick={ () => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-[var(--txt2-var)] hover:text-[var(--txt-var)] transition">
          <X size={24} />
        </button>

        <h3 className="text-xl font-medium text-[var(--text-var)]">
        Excluir Perfil de Usuário?
        </h3>

        <p className="mt-4 text-base text-gray-600">
          Tem certeza de que deseja excluir seu perfil?
          <span className="font-bold text-[var(--txt-var)]">
          {' '}
          Esta ação é irreversível.
        </span>
      </p>

        <div className="mt-6 flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-[var(--txt-var)] hover:bg-gray-50 transition">
            Cancelar
            </button>

          <Button
            label="Sim, Excluir Perfil"
            variant="danger"
            onClick={handleConfirmDelete}
          />
        </div>
        </div>
      </div>
    )}
</>
  )
}