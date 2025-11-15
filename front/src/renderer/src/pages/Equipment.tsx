import { useEquipment } from '@hooks/useEquipment'
import Button from '@renderer/components/Button'
import Input from '@renderer/components/Input'
import Sidebar from '@renderer/components/Sidebar'
import { ListFilter, Plus } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface EquipmentCardProps {
  id: string
  name: string
  ean: string
  alocatedAtId: string
  disabled: boolean
  createdAt: string
  alocatedAt?: {
    id: string
    name: string
    location: string
    responsableName: string
    responsableEmail: string
  }
}

const EquipmentCardRow: React.FC<{
  equipment: EquipmentCardProps
  onEdit: (id: string) => void
  onDelete: (id: string, name: string) => void
}> = ({ equipment, onEdit, onDelete }) => {
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm flex flex-col gap-3 hover:shadow-md transition">
      {/* Header: Título e Ações */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-gray-900">{equipment.name}</h2>
          <span className="text-sm text-gray-500">EAN: {equipment.ean}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(equipment.id)}
            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded transition"
            title="Editar"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(equipment.id, equipment.name)}
            className="px-3 py-1 text-sm text-red-600 hover:bg-red-100 rounded transition"
            title="Deletar"
          >
            Deletar
          </button>
        </div>
      </div>

      {/* Status e Info */}
      <div className="flex flex-row items-center justify-between">
        <div>
          <span
            className={`rounded-full px-4 py-1 text-sm font-semibold ${
              equipment.disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}
          >
            {equipment.disabled ? 'Desativado' : 'Ativo'}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          <strong>Departamento:</strong> {equipment.alocatedAt?.name || equipment.alocatedAtId}
        </div>
        <div className="text-sm text-gray-600">
          <strong>Criado em:</strong> {new Date(equipment.createdAt).toLocaleDateString('pt-BR')}
        </div>
      </div>
    </div>
  )
}

function Equipment(): React.JSX.Element {
  const navigate = useNavigate()
  const location = useLocation()
  const { equipments, isLoading, loadEquipments, deleteEquipment } = useEquipment()
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    void loadEquipments()
  }, [location.pathname, loadEquipments])

  const filteredEquipment = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()

    return equipments.filter((equipment) => {
      const nameMatch = equipment.name.toLowerCase().includes(term)
      const eanMatch = equipment.ean.toLowerCase().includes(term)
      return nameMatch || eanMatch
    })
  }, [searchTerm, equipments])

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
    <div className="w-screen h-screen bg-white flex justify-center items-center relative py-[120px]">
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Conteúdo central da página */}
      <div className="flex w-full max-w-[1400px] h-screen overflow-hidden py-20 px-8 flex-col items-start gap-2.5">
        <div className="flex flex-col w-full gap-2.5 shrink-0 top-[120px] bg-white pb-4 z-10">
          <h1 className="font-bold text-2xl leading-normal">Buscar Equipamentos</h1>
          <div className="flex flex-row gap-2.5 w-full">
            <Input
              type="search"
              labelVariant="default"
              placeholder="Digite o nome ou código do equipamento"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-[30px] flex-1"
            />
            <Button
              label="Adicionar Equipamento"
              variant="secondary"
              endIcon={<Plus size={16} />}
              className="h-[30px] w-[196px] whitespace-nowrap"
              onClick={() => {
                navigate('/equipment-create')
              }}
            />
            <Button
              label="Filtrar"
              variant="primary"
              endIcon={<ListFilter size={16} />}
              className="h-[30px]"
              onClick={() => {
                // TODO: Implementar modal de filtros
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96 w-full">
            <p className="text-gray-500">Carregando equipamentos...</p>
          </div>
        ) : (
          <div className="w-full flex-1 overflow-y-auto flex flex-col gap-2.5">
            {filteredEquipment.length > 0 ? (
              filteredEquipment.map((equipment) => (
                <EquipmentCardRow
                  key={equipment.id}
                  equipment={equipment}
                  onEdit={(id) => navigate(`/equipment-edit/${id}`)}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="flex justify-center items-center h-40 w-full">
                <p className="text-gray-500">
                  {equipments.length === 0
                    ? 'Nenhum equipamento cadastrado.'
                    : 'Nenhum equipamento encontrado.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Equipment
