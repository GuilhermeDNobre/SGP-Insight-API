import { useEquipment } from '@hooks/useEquipment'
import Sidebar from '@renderer/components/Sidebar'
import { Edit, Plus, Trash2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Equipment(): React.JSX.Element {
  const navigate = useNavigate()
  const { equipments, isLoading, loadEquipments, deleteEquipment } = useEquipment()

  useEffect(() => {
    void loadEquipments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDelete = async (id: string, name: string): Promise<void> => {
    if (window.confirm(`Tem certeza que deseja deletar o equipamento "${name}"?`)) {
      try {
        await deleteEquipment(id)
        alert('Equipamento deletado com sucesso!')
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Erro ao deletar equipamento')
      }
    }
  }

  return (
    <div className="flex w-screen h-screen bg-white">
      <Sidebar />

      <main className="grow flex flex-col p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Equipamentos</h1>
          <button
            onClick={() => navigate('/equipment-create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            <Plus size={20} />
            Novo Equipamento
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <p className="text-gray-500">Carregando equipamentos...</p>
          </div>
        ) : equipments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <p className="text-gray-500 text-lg">Nenhum equipamento cadastrado</p>
            <button
              onClick={() => navigate('/equipment-create')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Criar Primeiro Equipamento
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
                    EAN
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Departamento
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Data Criação
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {equipments.map((equipment) => (
                  <tr key={equipment.id} className="hover:bg-gray-50 transition border-b">
                    <td className="px-6 py-4 text-sm text-gray-800">{equipment.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{equipment.ean}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{equipment.alocatedAtId}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          equipment.disabled
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {equipment.disabled ? 'Desativado' : 'Ativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(equipment.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => navigate(`/equipment-edit/${equipment.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(equipment.id, equipment.name)}
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

export default Equipment
