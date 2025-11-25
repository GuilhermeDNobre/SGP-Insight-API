import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDepartment } from '@hooks/useDepartment'
import { useEquipment } from '@hooks/useEquipment'
import { ComponentData } from '@renderer/types/equipment'
import Sidebar from '@renderer/components/Sidebar'
import Button from '@renderer/components/Button'
import { ComponentTable } from '@renderer/components/ComponentsTable'
import { ArrowLeft, Pencil } from 'lucide-react'
import api from '@renderer/services/api'

// Interface interna para a resposta da API
interface BackendComponent {
  id: string
  name: string
  status: string
}

export default function EquipmentDetails(): React.JSX.Element {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  
  const { loadEquipmentById, equipment, isLoading } = useEquipment()
  const { departments, loadDepartments } = useDepartment()
  const [components, setComponents] = useState<ComponentData[]>([])

  // Carrega Equipamento e Componentes
  useEffect(() => {
    void loadDepartments()
    if (id) {
      void loadEquipmentById(id)
      void loadComponents()
    }
  }, [id, loadEquipmentById, loadDepartments])

  const loadComponents = useCallback(async () => {
    if (!id) return
    try {
      const response = await api.get<BackendComponent[]>(`/components/equipment/${id}`)
      
      // Mesma lógica de formatação do Edit
      const formatted = response.data.map((c) => {
        const rawName = c.name || ''
        const separatorRegex = /\s+-\s+/;
        let type = 'Geral'
        let model = rawName 

        const parts = rawName.split(separatorRegex)
        if (parts.length >= 2) {
          type = parts[0].trim()
          model = parts.slice(1).join(' - ').trim()
        }

        return { id: c.id, type, model }
      })
      setComponents(formatted)
    } catch (error) {
      console.error('Erro ao carregar componentes', error)
    }
  }, [id])

  const getDepartmentName = (deptId: string | undefined): string => {
    if (!deptId) return 'Não alocado'
    const dept = departments.find(d => d.id === deptId)
    return dept ? dept.name : 'Departamento não encontrado' // ou mostra o ID se preferir
  }

  if (isLoading || !equipment) {
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
                onClick={() => navigate('/equipments')}
                className="flex items-center text-gray-500 hover:text-gray-700 mb-2 text-sm transition"
              >
                <ArrowLeft size={16} className="mr-1" /> Voltar para lista
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{equipment.name}</h1>
              <p className="text-sm text-gray-400 mt-1">ID: {equipment.id}</p>
            </div>
            
            <Button
              label="Editar"
              variant="secondary"
              endIcon={<Pencil size={16} />}
              onClick={() => navigate(`/equipment-edit/${equipment.id}`)}
            />
          </div>

          {/* Corpo de Detalhes */}
          <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
            
            {/* Grid de Informações */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase block mb-1">EAN / Patrimônio</span>
                <span className="text-lg font-mono text-gray-800">{equipment.ean}</span>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Departamento</span>
                <span className="text-lg text-gray-800">
                  {getDepartmentName(equipment.alocatedAtId)}
                </span>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase block mb-1">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium mt-1
                  ${!equipment.disabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {!equipment.disabled ? 'Ativo' : 'Desativado'}
                </span>
              </div>
            </div>

            {/* Lista de Componentes (Somente Leitura) */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 pb-2">Componentes Instalados</h3>
              <div className="rounded-lg border border-gray-200 overflow-hidden">
          
                <ComponentTable components={components} />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}