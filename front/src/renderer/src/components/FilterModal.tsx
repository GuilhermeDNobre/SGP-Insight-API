import React from 'react'
import Button from "@components/Button";
import { X } from 'lucide-react'

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function StatusCheckbox({ label, colorClass }: { label: string, colorClass: string}) {
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
            <span className={`px-2 py-0.5 rounded-md text-sm text-white ${colorClass}`}>
                {label}
            </span>
        </label>
    )
}

export default function FilterModal({ isOpen, onClose }: FilterModalProps): React.JSX.Element | null {
    if (!isOpen) {
        return null
    }

    const handleClearFilters = (): void => {
        console.log('Limpando filtros')
        // Lógica para limpar os filtros
    }

    const handleConfirmFilters = (): void => {
        console.log('Aplicando filtros')
        // Lógica para aplicar os filtros
        onClose()
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
            >
            
            <div
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
                >
            
         <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-[var(--txt)]">
            Filtrar Equipamentos
          </h3>  
          <button
          type="button"
          onClick={onClose}
          className="text-[var(--txt2-var)] hover:text-[var(--txt)] transition"
          >
            <X size={24} />
          </button>
        </div>

        <div>
            <h4 className="text-base font-medium text-[var(--txt)] mb-3">Por Status:</h4>
            <div className="grid grid-cols-2 gap-3">
              <StatusCheckbox label="Ativo" colorClass="bg-[var(--sec)]" />
              <StatusCheckbox label="Em Manutenção" colorClass="bg-[var(--atencio)]" />
              <StatusCheckbox label="Disponível" colorClass="bg-[var(--sucess)]" />
              <StatusCheckbox label="Indisponível" colorClass="bg-[var(--gray)]" />
            </div>
          </div>

        <div>
           <h4 className="text-base font-medium text-[var(--txt)] mb-3">Por Departamento:</h4>
            <select
              className="w-full rounded-md border border-[var(--gray-light)] bg-white
                px-3 py-2 text-sm text-[var(--txt)] placeholder:text-[var(--gray)]
                focus:outline-none focus:ring-2 focus:ring-[var(--pri)] focus:border-[var(--pri)]
                hover:border-[var(--pri)] transition-colors"
            >
              <option value="">Selecione um departamento</option>
              <option value="dep1">Departamento 1</option>
              <option value="dep2">Departamento 2</option>
              <option value="dep3">Departamento 3</option>
              <option value="dep4">Departamento 4</option>
            </select>
          </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="h-[30px] pl-3.5 pr-3.5 pt-2 pb-2 text-[14px] inline-flex items-center justify-center font-medium rounded transition focus:outline-none cursor-pointer border border-gray-300 bg-white text-[var(--txt)] hover:bg-gray-50 whitespace-nowrap"
            >
                <span>Cancelar Filtro</span>
            </button>

            <Button
                label="Limpar Filtros"
                variant="danger"
                onAction={handleClearFilters}
                className="whitespace-nowrap"
            />

            <Button
                label="Confirmar Filtragem"
                variant="success"
                onAction={handleConfirmFilters}
                className="whitespace-nowrap"
            />
        </div>
        </div>
    </div>
    )
}