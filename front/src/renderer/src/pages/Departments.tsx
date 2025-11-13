import { useDepartment } from '@hooks/useDepartment'
import Sidebar from '@renderer/components/Sidebar'
import { Edit, Plus, Trash2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Departments(): React.JSX.Element {
  const navigate = useNavigate()
  const { departments, isLoading, deleteDepartment } = useDepartment()

  useEffect(() => {
    // Mock data - comentar quando tiver API
    const mockDepartments = [
      {
        id: '1',
        name: 'TI',
        location: 'Sala 101',
        responsableName: 'João Silva',
        responsableEmail: 'joao@example.com'
      },
      {
        id: '2',
        name: 'Recursos Humanos',
        location: 'Sala 201',
        responsableName: 'Maria Santos',
        responsableEmail: 'maria@example.com'
      },
      {
        id: '3',
        name: 'Financeiro',
        location: 'Sala 301',
        responsableName: 'Pedro Costa',
        responsableEmail: 'pedro@example.com'
      }
    ]
    // Não chamar loadDepartments() por enquanto, usando mock
  }, [])

  const handleDelete = async (id: string, name: string): Promise<void> => {
    if (window.confirm(`Tem certeza que deseja deletar o departamento "${name}"?`)) {
      try {
        await deleteDepartment(id)
        alert('Departamento deletado com sucesso!')
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Erro ao deletar departamento')
      }
    }
  }

  return (
    <div className="flex w-screen h-screen bg-white">
      <Sidebar />

      <main className="grow flex flex-col p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Departamentos</h1>
          <button
            onClick={() => navigate('/department-create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            <Plus size={20} />
            Novo Departamento
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-gray-500">Carregando departamentos...</p>
          </div>
        ) : departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <p className="text-gray-500 text-lg">Nenhum departamento cadastrado</p>
            <button
              onClick={() => navigate('/department-create')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Criar Primeiro Departamento
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Responsável
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Email
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {departments.map((department) => (
                  <tr key={department.id} className="hover:bg-gray-50 transition border-b">
                    <td className="px-6 py-4 text-sm text-gray-800 font-semibold">
                      {department.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{department.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {department.responsableName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {department.responsableEmail}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/department-edit/${department.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(department.id, department.name)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                          title="Deletar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

export default Departments
