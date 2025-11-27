import { useEquipment } from '@hooks/useEquipment'
import { useDepartment } from '@renderer/hooks/useDepartment'
import Button from '@renderer/components/Button'
import Input from '@renderer/components/Input'
import Sidebar from '@renderer/components/Sidebar'
import FilterModal, { FilterValues } from '@renderer/components/FilterModal'
import { ListFilter, Plus, Edit, Trash2, Eye} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Equipment(): React.JSX.Element {
  const navigate = useNavigate()
  const { 
    equipments, 
    isLoading, 
    loadEquipments, 
    deleteEquipment,
    page,          // Página atual
    totalPages,    // Total de páginas
    changePage     // Função para trocar página
  } = useEquipment()

  const { departments, loadDepartments } = useDepartment() // Para preencher o select do modal de filtragem

  const [searchTerm, setSearchTerm] = useState<string>('')

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterValues>({
    departmentId: '',
    onlyActive: false
  })

  useEffect(() => {
    void loadDepartments()
  }, []) // eslint-disable-line

  useEffect(() => {
    void loadEquipments(page, searchTerm, activeFilters)
  }, [loadEquipments, page, activeFilters])

  const handleDelete = async (id: string, name: string): Promise<void> => {
    if (window.confirm(`Tem certeza que deseja deletar o equipamento "${name}"?`)) {
      try {
        await deleteEquipment(id)
        alert('Equipamento deletado com sucesso!')
        await loadEquipments(page)
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Erro ao deletar equipamento')
      }
    }
  }

  const handleSearch = (): void => {
    // Volta para a página 1 sempre que buscar algo novo
    void loadEquipments(1, searchTerm, activeFilters)
  }

  // --- Handlers do Modal ---

  const handleApplyFilters = (filters: FilterValues) => {
    setActiveFilters(filters)
    // Volta para página 1 ao filtrar
    changePage(1) 
  }

  const handleClearFilters = () => {
    const emptyFilters = { departmentId: '', onlyActive: false }
    setActiveFilters(emptyFilters)
    changePage(1)
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
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
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col flex-1 overflow-hidden w-full">
          
          {/* Área de Rolagem da Tabela */}
          <div className="overflow-auto flex-1 ">
            <table className="text-left text-sm text-gray-600 w-full border-collapse">
              <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-700 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-6 py-4">Modelo / Nome</th>
                  <th className="px-6 py-4">EAN</th>
                  <th className="px-6 py-4">Setor</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  // ESTADO DE CARREGAMENTO (Adaptado para Tabela)
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <div className="flex flex-col justify-center items-center gap-3">
                         <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                        <p className="text-gray-500 text-lg">Carregando equipamentos...</p>
                      </div>
                    </td>
                  </tr>
                ) : equipments.length === 0 ? (
                  // ESTADO VAZIO (Com a lógica que você pediu)
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-gray-500 text-lg">
                          {searchTerm 
                            ? 'Nenhum equipamento encontrado para sua busca.' 
                            : 'Nenhum equipamento cadastrado.'}
                        </p>
                        {searchTerm && (
                          <button 
                            onClick={() => setSearchTerm('')} // Limpa a busca
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Limpar filtros
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  // LISTAGEM DOS DADOS
                  equipments.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {item.ean || '-'}
                      </td>
                      <td className="px-6 py-4">
                        {item.alocatedAt?.name || <span className="text-gray-400 italic">Não alocado</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${!item.disabled 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${!item.disabled ? 'bg-green-600' : 'bg-red-600'}`}></span>
                          {!item.disabled ? 'Ativo' : 'Desativado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/equipment-details/${item.id}`)}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition"
                            title="Ver Detalhes"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => navigate(`/equipment-edit/${item.id}`)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id, item.name)}
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

          {/* Rodapé de Paginação */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50 shrink-0">
            <span className="text-sm text-gray-700">
              Página <span className="font-semibold text-gray-900">{page}</span> de <span className="font-semibold text-gray-900">{totalPages}</span>
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={() => changePage(page - 1)}
                disabled={page === 1 || isLoading}
                className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Anterior
              </button>
              <button
                onClick={() => changePage(page + 1)}
                disabled={page === totalPages || isLoading}
                className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Próximo
              </button>
            </div>
          </div>
        </div>

        <FilterModal 
          isOpen={isFilterModalOpen} 
          onClose={() => setIsFilterModalOpen(false)}
          departments={departments} // Passando a lista
          currentFilters={activeFilters} // Passando estado atual
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      </div>
    </div>
  )
}

export default Equipment
