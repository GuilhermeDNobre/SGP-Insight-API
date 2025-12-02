import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDepartment } from '@hooks/useDepartment'
import Sidebar from '@renderer/components/Sidebar'
import Button from '@renderer/components/Button'
import { ArrowLeft, Pencil } from 'lucide-react'

export default function DepartmentDetails(): React.JSX.Element {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  
  const { loadDepartmentById, department, isLoading } = useDepartment()
  
  useEffect(() => {
    if (id) {
      void loadDepartmentById(id)
    }
  }, [id, loadDepartmentById])

  // Carrega Departamento
  if (isLoading || !department) {
    return (
      <div className="flex w-screen h-screen bg-gray-100 items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="flex w-screen h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <main className="grow flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg w-[800px] h-[520px] flex flex-col border border-gray-200">
          
          {/* Header com Botão Voltar */}
          <div className="p-8 border-b border-gray-100 flex justify-between items-start shrink-0">
            <div>
              <button 
                onClick={() => navigate('/departments')}
                className="flex items-center text-gray-500 hover:text-gray-700 mb-2 text-sm transition"
              >
                <ArrowLeft size={16} className="mr-1" /> Voltar para lista
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{department.name}</h1>
              <p className="text-sm text-gray-400 mt-1">ID: {department.id}</p>
            </div>
            
            <Button
              label="Editar"
              variant="secondary"
              endIcon={<Pencil size={16} />}
              onClick={() => navigate(`/department-edit/${department.id}`)}
            />
          </div>

          {/* Corpo de Detalhes */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
            
            {/* Grid de Informações */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Localização</span>
                <span className="text-lg text-gray-800">{department.location}</span>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Responsável</span>
                <span className="text-lg text-gray-800">
                  {department.responsableName}
                  <span className="block text-sm text-gray-500 mt-1">
                    ({department.responsableEmail})
                  </span>
                </span>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Quantidade de Equipamentos</span>
                <span className="text-lg text-gray-800">
                  {department.equipmentCount}
                </span>
              </div>
            </div>



          </div>
        </div>
      </main>
    </div>
  )
}