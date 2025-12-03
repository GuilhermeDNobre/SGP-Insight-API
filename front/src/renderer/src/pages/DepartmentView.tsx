import React, { useEffect, useCallback, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDepartment } from '@hooks/useDepartment'
import MovementsTable from '@renderer/components/MovementsTable'
import Sidebar from '@renderer/components/Sidebar'
import Button from '@renderer/components/Button'
import { ArrowLeft, Pencil } from 'lucide-react'
import { EquipmentMove } from '../types/equipment_move'
import api from '@renderer/services/api'

export default function DepartmentDetails(): React.JSX.Element {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  
  const { loadDepartmentById, department, isLoading } = useDepartment()

  const [history, setHistory] = useState<EquipmentMove[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 3
  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE)
  const currentData = history.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  )
  const tableTitleRef = useRef<HTMLHeadingElement>(null)
  const handlePageChange = (newPage: number): void => {
    setCurrentPage(newPage)
    
    // Rola a tela até o título da tabela
    if (tableTitleRef.current) {
      tableTitleRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  }

  useEffect(() => {
    if (id) {
      void loadDepartmentById(id)
      void loadFullHistory(id)
    }
  }, [id, loadDepartmentById])

  const loadFullHistory = useCallback(async (deptId: string) => {
    setLoadingHistory(true)
    try {
      // Faz duas requisições em paralelo
      const [resIn, resOut] = await Promise.all([
        api.get(`/equipment-move?newlyAlocatedAtId=${deptId}&limit=50`),     // Entradas
        api.get(`/equipment-move?previouslyAlocatedAtId=${deptId}&limit=50`) // Saídas
      ])

      const movesIn = resIn.data.data || []
      const movesOut = resOut.data.data || []

      // Junta as duas listas
      const combined = [...movesIn, ...movesOut]

      // Remove duplicatas
      const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)

      // Ordena por data (mais recente primeiro)
      unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

      setHistory(unique)
    } catch (error) {
      console.error('Erro ao carregar histórico', error)
    } finally {
      setLoadingHistory(false)
    }
  }, [])

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
          <div className="flex flex-col flex-1 overflow-y-auto p-8 gap-8">
            
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

            <div> 
              <h3
                ref={tableTitleRef} 
                className="text-lg font-bold text-gray-800 mb-4 pb-2 w-full"
              >
                Histórico de Movimentações de Equipamentos
              </h3>
       
              <MovementsTable 
                movements={currentData} 
                isLoading={loadingHistory} 
                showEquipmentColumn={true}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(handlePageChange)}
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}