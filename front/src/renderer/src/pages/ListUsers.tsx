import Button from '@components/Button'
import Input from '@components/Input'
import Sidebar from '@components/Sidebar'
import ConfirmModal from '@renderer/components/ConfirmModal'
import api from '@services/api'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
  id: string
  firstName: string
  email: string
  role: string
  deleted?: boolean
}

export default function ListUsers(): React.JSX.Element {
  const navigate = useNavigate()

  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  async function loadUsers(): Promise<void> {
    setIsLoading(true)

    try {
      const response = await api.get('/users')

      const filtered = response.data.filter(
        (u: User) =>
          u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )

      setUsers(filtered)
      setTotalPages(1) // caso implemente paginação real via backend, atualize aqui
    } catch (err) {
      console.error(err)
    }

    setIsLoading(false)
  }

  function handleSearch(): void {
    loadUsers()
  }

  async function handleDeleteUser(): Promise<void> {
    if (!selectedUser) return

    try {
      await api.delete(`/users/${selectedUser.id}`)
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id))
    } catch (err) {
      console.error(err)
    } finally {
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
    }
  }

  useEffect(() => {
    // Carrega os usuários apenas uma vez quando o componente é montado
    loadUsers()
  }, []) // O array de dependências vazio garante que isso seja executado apenas uma vez

  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center relative py-[120px]">
      <Sidebar />

      <div className="flex w-full max-w-[1400px] h-screen overflow-hidden py-20 px-8 flex-col items-start gap-2.5">
        {/* HEADER */}
        <div className="flex flex-col w-full gap-2.5 bg-white pb-4 z-10">
          <h1 className="font-bold text-2xl leading-normal">Listagem de Usuários</h1>

          <div className="flex flex-row gap-2.5 w-full">
            <Input
              type="search"
              labelVariant="default"
              placeholder="Pesquisar Usuários"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="h-[30px] flex-1"
            />

            <Button
              label="Adicionar Usuário"
              variant="secondary"
              endIcon={<Plus size={16} />}
              className="h-[30px] w-[180px] whitespace-nowrap"
              onClick={() => navigate('/user-create')}
            />
          </div>
        </div>

        {/* CONTAINER DA TABELA */}
        <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col flex-1 overflow-hidden w-full">
          <div className="overflow-auto flex-1">
            <table className="text-left text-sm text-gray-600 w-full border-collapse">
              <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-700 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Cargo</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <div className="flex flex-col justify-center items-center gap-3">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                        <p className="text-gray-500 text-lg">Carregando usuários...</p>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <p className="text-gray-500 text-lg">Nenhum usuário encontrado.</p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 font-medium text-gray-900">{user.firstName}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.role}</td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-green-600"></span>
                          Ativo
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/user-edit/${user.id}`)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDeleteModalOpen(true)
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                            title="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINAÇÃO */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
            <span className="text-sm text-gray-700">
              Página <strong>{page}</strong> de <strong>{totalPages}</strong>
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm hover:bg-gray-100 disabled:opacity-50"
              >
                Anterior
              </button>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm hover:bg-gray-100 disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o usuário ${selectedUser?.firstName}?`}
        onConfirm={handleDeleteUser}
        onCancel={() => {
          setIsDeleteModalOpen(false)
          setSelectedUser(null)
        }}
      />
    </div>
  )
}
