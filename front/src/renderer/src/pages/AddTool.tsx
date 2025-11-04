import Sidebar from '@components/Sidebar'
import React from 'react';
import { useAddEquipment } from '@renderer/hooks/useAddEquipment';
import { ComponentTable } from '@components/ComponentsTable';
import Input from '@components/Input';
import Button from '@components/Button';
import AddComponentModal from '@renderer/components/AddComponentModal';
import { useNavigate } from 'react-router-dom';

export default function AddTool(): React.JSX.Element {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const {
    formData,
    setFormData,
    components,
    departments,
    statuses,
    handleAddComponent,
    handleRemoveComponent,
    handleSubmit,
  } = useAddEquipment();

  // Função genérica para atualizar o estado do formulário
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função que será passada para o modal de adicionar componente
  const handleAddComponentModal = (data: { tipo: string; modelo: string }): void => {
    handleAddComponent(data);
    setIsModalOpen(false);
  }

  return (
    <div className="w-screen h-screen bg-(--white) flex justify-center items-center relative">
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Conteúdo central da página */}
      <div className="flex w-[1400px] pb-[21px] overflow-hidden flex-col items-center gap-2.5">
        <div className="flex w-full max-w-4xl shrink-0 flex-col gap-6 rounded-lg bg-white p-8 shadow-lg">
        
          {/* Título e ID */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Adicionar Equipamento</h1>
            <p className="pt-1.5 text-sm text-gray-500">ID: AN0000001 (Gerado automaticamente)</p>
          </div>

          {/* Campos Principais (Modelo, Setor, Status) */}
          <div className="flex flex-col gap-4 ">
            {/* Modelo */}
            <Input
              label="Modelo"
              labelVariant="default"
              name="model"
              value={formData.model}
              onChange={handleFormChange}
              placeholder="Ex: Dell Optiplex 3090"
            />
          
            <div className="flex flex-col gap-4 md:flex-row md:gap-6">
              {/* Setor */}
              <div className="flex flex-col gap-1 md:flex-1">
                <label htmlFor="departmentId" className="text-sm font-medium text-gray-700">Setor</label>
                <select
                  id="departmentId"
                  name="departmentId"
                  value={formData.departmentId || ''}
                  onChange={handleFormChange}
                  className="h-[30px] border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="" disabled>Selecione um setor</option>
                  {departments.map(dep => (
                    <option key={dep.id} value={dep.id}>{dep.name}</option>
                  ))}
                </select>
              </div>

              {/* Status*/}
              <div className="flex flex-col gap-1 md:flex-1">
                <label htmlFor="status" className="text-sm font-medium text-gray-700">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status || ''}
                  onChange={handleFormChange}
                  className="h-[30px] border border-gray-300 rounded px-3 py-1 text-sm"
                >
                  <option value="" disabled>Selecione um status</option>
                  {statuses.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        
          {/* Tabela de Componentes */}
          <div className="h-48 overflow-y-auto flex flex-col">
            <ComponentTable
              components={components}
              onAdd={() => setIsModalOpen(true)}
              onRemove={handleRemoveComponent}
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              label="Cancelar"
              variant="secondary"
              onClick={() => {
                navigate('/tools')
              }}
            />
            <Button
              label="Adicionar Equipamento"
              variant="primary" // Use 'primary'
              className="bg-green-600 hover:bg-green-700 text-white" // Sobrescreve a cor
              onClick={handleSubmit}
            />
          </div>

        </div>
        {/* Aqui você renderizaria o Modal de Adicionar Componente
          {isModalOpen && <AddComponentModal ... />} 
        */}
      </div>

      <AddComponentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddComponent={handleAddComponentModal}
      />
    </div>
  )
}