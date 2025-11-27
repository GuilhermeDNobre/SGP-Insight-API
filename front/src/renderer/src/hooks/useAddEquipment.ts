import { useState, useEffect } from 'react';

import { ComponentData } from '@renderer/types/equipment';
import { Department, MOCKED_DEPARTMENTS } from '@renderer/mocks/department.mock';
import { StatusOption, MOCKED_STATUSES } from '@renderer/mocks/equipment-statuses.mock';

// Dados do formulário principal
interface EquipmentFormData {
  model: string;
  departmentId: string | null;
  status: string | null;
}

// O que o hook retorna
export interface UseAddEquipmentReturn {
  formData: EquipmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<EquipmentFormData>>;
  components: ComponentData[];
  departments: Department[];
  statuses: StatusOption[];
  handleAddComponent: (data: { tipo: string; modelo: string }) => void;
  handleRemoveComponent: (id: string) => void;
  handleSubmit: () => void;
  // TODO: Adicionar isModalOpen, etc.
}

export function useAddEquipment(): UseAddEquipmentReturn {
  // Estado para os campos principais
  const [formData, setFormData] = useState<EquipmentFormData>({
    model: '',
    departmentId: null,
    status: null,
  });

  // Estado para a lista de componentes
  const [components, setComponents] = useState<ComponentData[]>([]);

  // Estados para os dados dos dropdowns
  const [departments, setDepartments] = useState<Department[]>([]);
  const [statuses, setStatuses] = useState<StatusOption[]>([]);

  // Simula o carregamento dos dados dos dropdowns
  useEffect(() => {
    // Na vida real, seriam chamadas de API
    setDepartments(MOCKED_DEPARTMENTS);
    setStatuses(MOCKED_STATUSES);
    
    // Mock inicial da tabela para visualização (como na sua imagem)
    setComponents([
      { id: 'c1', type: 'Processador', name: 'Intel Core i7-12700K' },
      { id: 'c2', type: 'Placa de Vídeo', name: 'NVIDIA RTX 4070' },
      { id: 'c3', type: 'Armazenamento (SSD)', name: 'Samsung 980 PRO 1TB' },
      { id: 'c4', type: 'Memória RAM', name: 'Kingston Fury 16GB' },
    ]);
  }, []);

  // Função para adicionar um novo componente (aqui está simplificado)
  const handleAddComponent = (data: { tipo: string; modelo: string }): void => {
    const newComponent: ComponentData = {
      id: crypto.randomUUID(),
      type: data.tipo,
      name: data.modelo,
    };

    setComponents((prev) => [...prev, newComponent]);
  };

  // Função para remover um componente da lista
  const handleRemoveComponent = (idToRemove: string): void => {
    setComponents(prev => prev.filter(comp => comp.id !== idToRemove));
  };

  // Função para enviar o formulário
  const handleSubmit = (): void => {
    // TODO: Validar campos e enviar para a API
    const newEquipment = {
      id: 'AN0000001', // ID Gerado
      ...formData,
      components: components,
    };
    console.log('Salvando Equipamento:', newEquipment);
    alert('Equipamento salvo! (Veja no console)');
  };

  return {
    formData,
    setFormData,
    components,
    departments,
    statuses,
    handleAddComponent,
    handleRemoveComponent,
    handleSubmit,
  };
}