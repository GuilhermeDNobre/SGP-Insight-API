import { useDepartment } from '@hooks/useDepartment'
import Button from '@renderer/components/Button'
import Input from '@renderer/components/Input'
import Sidebar from '@renderer/components/Sidebar'
import ConfirmModal from '@renderer/components/ConfirmModal'
import { Edit, Plus, Trash2 } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSnackbar } from '@renderer/context/SnackbarContext'

function Departments(): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const { showSnackbar } = useSnackbar()
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<{ id: string, name: string } | null>(null)
  const handleDeleteClick = (id: string, name: string): void => {
    setDepartmentToDelete({ id, name })
    setIsDeleteModalOpen(true)
  }             

  const [searchTerm, setSearchTerm] = useState<string>('')
  const { departments, isLoading, loadDepartments, deleteDepartment } = useDepartment()

  useEffect(() => {
    void loadDepartments()
  }, [location.pathname, loadDepartments])

  const filteredDepartment = useMemo(() => {
      const term = searchTerm.toLowerCase().trim()
  
      return departments.filter((department) => {
        const nameMatch = department.name.toLowerCase().includes(term)
        const idMatch = department.id.toLowerCase().includes(term)
        return nameMatch || idMatch
      })
    }, [searchTerm, departments])

  const handleDelete = async (): Promise<void> => {
    if (!departmentToDelete) return
    
    try {
      await deleteDepartment(departmentToDelete.id)
      showSnackbar('Departamento deletado com sucesso!', 'success')
      await loadDepartments()
    } catch (error) {
      console.error('Erro ao deletar departamento:', error)
      showSnackbar(`Erro ao deletar departamento. "${error}" `, 'error')
    } finally {
      setIsDeleteModalOpen(false)
      setDepartmentToDelete(null)
    }
  }

  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center relative py-[120px]">
      <Sidebar />

      <main className="flex w-full max-w-[1400px] h-screen overflow-hidden py-20 px-8 flex-col items-start gap-2.5">
        <div className="flex flex-col w-full gap-2.5 shrink-0 top-[120px] bg-white pb-4 z-10">
          <h1 className="font-bold text-2xl leading-normal">Departamentos</h1>
            <div className="flex flex-row gap-2.5 w-full">
              <Input
                type="search"
                labelVariant="default"
                placeholder="Digite o nome ou ID do departamento"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-[30px] flex-1"
              />
              <Button
                label="Novo Departamento" 
                variant="secondary"
                endIcon={<Plus size={16} />}
                onClick={() => navigate('/department-create')}
                className="h-[30px] w-[196px] whitespace-nowrap"
              />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96 w-full">
            <p className="text-gray-500">Carregando departamentos...</p>
          </div>
        ) : departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4 w-full">
            <p className="text-gray-500 text-lg">Nenhum departamento cadastrado</p>
            <Button
              label="Criar Primeiro Departamento"
              variant="primary"
              onClick={() => navigate('/department-create')}
              className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
            />
          </div>
        ) : filteredDepartment.length === 0 ? (
          <div className="flex justify-center items-center h-96 w-full">
            <p className="text-gray-500">Nenhum departamento encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md w-full">
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
                {filteredDepartment.map((department) => (
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
                          onClick={() => handleDeleteClick(department.id, department.name)}
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

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Excluir Departamento"
        message={`Tem certeza que deseja excluir o departamento "${departmentToDelete?.name}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        variant="danger"
        confirmText="Excluir"
        isLoading={isLoading}
        closeOnOverlayClick={false}
      />
    </div>
  )

  
}

export default Departments
