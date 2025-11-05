import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '@components/Sidebar'
import Input from '@components/Input'
import Button from '@renderer/components/Button'
import { EquipmentCard } from '@renderer/components/EquipmentCard';
import { EquipmentData } from '@renderer/types/equipment';
import { MOCKED_EQUIPMENT_LIST } from '@renderer/mocks/equipment.mock';
import { ListFilter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Tools(): React.JSX.Element {
  const navigate = useNavigate()
  
  // Lógica de estado e filtro
  const [equipmentList, setEquipmentList] = useState<EquipmentData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Carregar a lista de equipamentos (chamada de API simulada por enquanto)
    setEquipmentList(MOCKED_EQUIPMENT_LIST);
  }, []);

  // Filtrar equipamentos com base no termo de busca
  const filteredEquipment = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    
    return equipmentList.filter((equipment) => {
      const nameMatch = equipment.name.toLowerCase().includes(term);
      const codeMatch = equipment.displayId.toLowerCase().includes(term);
      return nameMatch || codeMatch;
    });
  }, [searchTerm, equipmentList]);
  
  return (
    <div className="w-screen h-screen bg-(--white) flex justify-center items-center relative py-[120px]">
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Conteúdo central da página */}
      <div className="flex w-[1400px] h-screen overflow-hidden py-20 px-[140px] flex-col items-start gap-2.5">
        <div className="flex flex-col w-full gap-2.5 shrink-0 top-[120px] bg-(--white) pb-4 z-10">
          <h1 className="font-bold leading-normal">
            Buscar Equipamentos
          </h1>
          <div className='flex flex-row gap-2.5 w-full'>
            <Input
              type="search"
              labelVariant="default"
              placeholder="Digite o nome ou código do equipamento"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de busca 
              className='h-[30px] flex-1'
            />
            <Button
              label="Adicionar Equipamento"
              variant="secondary"
              endIcon={<Plus size={16} />}
              className="h-[30px] w-[196px] whitespace-nowrap"
              onClick={() => {
                navigate('/addTool')  
              }}
            />
            <Button
              label="Filtrar"
              variant="primary"
              endIcon={<ListFilter size={16} />}
              className="h-[30px]"
              onClick={() => {
                // Abrir modal de filtros
              }}
            />
          </div>
        </div>
        
        <div className="w-full flex-1 overflow-y-auto flex flex-col gap-2.5">
          {filteredEquipment.map((equipment) => (
            <EquipmentCard 
              key={equipment.id} 
              equipment={equipment} 
            />
          ))}

          {/* Mensagem de fallback se o filtro não retornar nada */}
          {filteredEquipment.length === 0 && (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Nenhum equipamento encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
