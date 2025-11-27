import React, { useState } from 'react'
import { EquipmentData, ComponentData } from '@renderer/types/equipment'

import { Eye, Pencil, Trash2 } from 'lucide-react'

interface EquipmentCardProps {
  equipment: EquipmentData;
}

// --- Componente do Corpo Resumido ---
const SummaryBody: React.FC<{ components: ComponentData[] }> = ({ components }) => {
  const componentNames = components.map(comp => comp.name).join(', ');
  return (
    <div className="text-sm text-gray-700">
      <strong>Componentes:</strong> {componentNames}
    </div>
  );
};

// --- Componente do Corpo Detalhado (Tabela) ---
const DetailBody: React.FC<{ components: ComponentData[] }> = ({ components }) => {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Tipo de Componente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Modelo
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {components.map((comp) => (
            <tr key={comp.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">{comp.type}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">{comp.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Componente Principal do Card ---
export const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment }) => {
  // Estado para controlar a visão (resumida ou detalhada)
  const [isExpanded, setIsExpanded] = useState(false);

  // Mapeia o status para o texto e cor do "Tag"
  const statusMap = {
    ativo: { text: 'Ativo', bg: 'bg-blue-600', textCol: 'text-white' },
    disponivel: { text: 'Disponível', bg: 'bg-green-600', textCol: 'text-white' },
    manutencao: { text: 'Em Manutenção', bg: 'bg-yellow-500', textCol: 'text-black' },
    indisponivel: { text: 'Indisponível', bg: 'bg-gray-500', textCol: 'text-white' },
  };
  const currentStatus = statusMap[equipment.status];

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm flex flex-col gap-1.5">
      {/* --- LINHA 1: Título e Ações --- */}
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{equipment.name}</h2>
        
        <div className="flex items-center justify-end space-x-3 gap-1.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Ocultar detalhes" : "Ver detalhes"}
            className="text-gray-500 hover:text-blue-600"
          >
            <Eye size={20} />
          </button>
          <button title="Editar" className="text-gray-500 hover:text-green-600">
            <Pencil size={20} />
          </button>
          <button title="Excluir" className="text-gray-500 hover:text-red-600">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* --- LINHA 2: ID --- */}
      <div>
        <span className="text-sm text-gray-500">ID: {equipment.displayId}</span>
      </div>

      {/* --- LINHA 3: Status e Localização --- */}
      <div className="flex flex-row items-center justify-between">
        {/* Status */}
        <div>
          <span
            className={`rounded-full px-4 py-1 text-sm ${currentStatus.bg} ${currentStatus.textCol}`}
          >
            <strong style={{ fontWeight: 'bold' }}>
              {currentStatus.text}
            </strong>
          </span>
        </div>
        {/* Localização */}
        <div className="text-sm text-gray-600">
          <strong>Localização:</strong> {equipment.location}
        </div>
      </div>

      {/* --- LINHA 4: Corpo (Condicional) --- */}
      {isExpanded ? (
        <DetailBody components={equipment.components} />
      ) : (
        <SummaryBody components={equipment.components} />
      )}
    </div>
  );
};