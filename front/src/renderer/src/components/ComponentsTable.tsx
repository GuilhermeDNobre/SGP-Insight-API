import React from 'react';
import { ComponentData } from '@renderer/types/equipment';
import Button from '@renderer/components/Button'; // Importe seu botão
import { Plus, Trash2 } from 'lucide-react';

interface ComponentTableProps {
  components: ComponentData[];
  onRemove?: (id: string) => void;
  onAdd?: () => void;
}

export const ComponentTable: React.FC<ComponentTableProps> = ({
  components,
  onRemove,
  onAdd,
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      
      {/* Tabela */}
      <div className="w-full overflow-hidden rounded-lg border border-gray-200 overflow-y-auto max-h-36">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tipo de Componente
              </th>
              <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Modelo
              </th>
              <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {components.map((comp) => (
              <tr key={comp.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">{comp.type}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">{comp.model}</td>
                {onRemove &&  (
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {/* Assumindo que seu botão pode ser pequeno ou ter variante "danger" */}
                    <Button
                      label="Remover"
                      variant="secondary" // Crie uma variante 'danger' se puder
                      className="h-auto bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
                      endIcon={<Trash2 size={14} />}
                      onClick={() => onRemove(comp.id)}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botão de Adicionar */}
      {onAdd && (
        <div className="flex justify-center pt-2 pb-4">
          <Button
            label="Adicionar Componente"
            variant="secondary"
            endIcon={<Plus size={16} />}
            onClick={onAdd}
          />
        </div>
      )}
    </div>
  );
};