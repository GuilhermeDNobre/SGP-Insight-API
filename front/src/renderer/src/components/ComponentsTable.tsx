import React from 'react';
import { ComponentData } from '@renderer/types/equipment';
import Button from '@renderer/components/Button'; // Importe seu botão
import { Plus, Trash2, Edit } from 'lucide-react';

interface ComponentTableProps {
  components: ComponentData[];
  onRemove?: (id: string) => void;
  onEdit?: (component: ComponentData) => void;
  onAdd?: () => void;
}

export const ComponentTable: React.FC<ComponentTableProps> = ({
  components,
  onRemove,
  onEdit,
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
                Tipo
              </th>
              <th className="sticky top-0 bg-gray-100 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Modelo
              </th>
              {(onRemove || onEdit) && (
                <th className="sticky top-0 bg-gray-100 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {components.length === 0 ? (
               <tr>
                 <td colSpan={3} className="px-6 py-8 text-center text-gray-500 text-sm">
                   Nenhum componente na lista.
                 </td>
               </tr>
            ) : (
              components.map((comp) => (
                <tr key={comp.id} className="hover:bg-gray-50 transition">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">{comp.type}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800">{comp.model}</td>
                  
                  {(onRemove || onEdit) && (
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        {/* BOTÃO EDITAR */}
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(comp)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        
                        {/* BOTÃO REMOVER */}
                        {onRemove && (
                          <button
                            type="button"
                            onClick={() => onRemove(comp.id)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded transition"
                            title="Remover"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
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