import React, { useState, useEffect } from 'react'
import Button from "@components/Button";
import { X } from 'lucide-react'
import { DepartmentData } from '@hooks/useDepartment'

export interface FilterValues {
    departmentId: string
    onlyActive: boolean
}

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    departments: DepartmentData[]; // Recebe a lista do banco
    currentFilters: FilterValues; // Recebe o estado atual para preencher
    onApply: (filters: FilterValues) => void; // Devolve os dados
    onClear: () => void;
}

function StatusCheckbox({ 
    label, 
    colorClass, 
    checked, 
    onChange 
}: { 
    label: string, 
    colorClass: string,
    checked: boolean,
    onChange: () => void
}): React.JSX.Element {
    return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={checked}
                onChange={onChange}
            />
            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold text-white ${colorClass}`}>
                {label}
            </span>
        </label>
    )
}

export default function FilterModal({ 
    isOpen, 
    onClose, 
    departments,
    currentFilters,
    onApply,
    onClear
}: FilterModalProps): React.JSX.Element | null {
    
    // Estados locais do modal
    const [selectedDep, setSelectedDep] = useState<string>('')
    const [activeChecked, setActiveChecked] = useState<boolean>(false)
    // Mantemos o estado visual do "Desativado", embora o back só suporte "onlyActive" por enquanto
    const [disabledChecked, setDisabledChecked] = useState<boolean>(false) 

    // Sincroniza o estado local com os filtros atuais quando o modal abre
    useEffect(() => {
        if (isOpen) {
            setSelectedDep(currentFilters.departmentId || '')
            setActiveChecked(currentFilters.onlyActive)
            setDisabledChecked(false) // Reset visual
        }
    }, [isOpen, currentFilters])

    if (!isOpen) return null

    const handleClearFilters = (): void => {
        setSelectedDep('')
        setActiveChecked(false)
        setDisabledChecked(false)
        onClear() // Avisa o pai para limpar
        onClose()
    }

    const handleConfirmFilters = (): void => {
        onApply({
            departmentId: selectedDep,
            onlyActive: activeChecked 
            // Nota: Se o usuário marcar "Desativado", a lógica atual do back 
            // (onlyActive=false) mostra TUDO. Para filtrar APENAS desativados,
            // precisaria de ajuste no back. Por ora, seguimos o onlyActive.
        })
        onClose()
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md flex flex-col gap-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabeçalho */}
                <div className="flex justify-between items-center border-b border-gray-100">
                    <h3 className="text-xl font-semibold text-(--txt)">
                      Filtrar Equipamentos
                    </h3> 
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Seção de Status */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Por Status:</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <StatusCheckbox 
                            label="Ativo" 
                            colorClass="bg-[var(--sucess)]"
                            checked={activeChecked}
                            onChange={() => setActiveChecked(!activeChecked)}
                        />
                        <StatusCheckbox 
                            label="Desativado" 
                            colorClass="bg-[var(--erro)]"
                            checked={disabledChecked}
                            onChange={() => setDisabledChecked(!disabledChecked)}
                        />
                        
                        {/* Mantidos visuais, mas desabilitados por enquanto conforme pedido */}
                        <div className="opacity-50 pointer-events-none">
                            <StatusCheckbox label="Disponível" colorClass="bg-blue-500" checked={false} onChange={()=>{}} />
                        </div>
                        <div className="opacity-50 pointer-events-none">
                            <StatusCheckbox label="Em Manutenção" colorClass="bg-[var(--atencio)]" checked={false} onChange={()=>{}} />
                        </div>
                    </div>
                </div>

                {/* Seção de Departamento */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Por Departamento:</h4>
                    <select
                        value={selectedDep}
                        onChange={(e) => setSelectedDep(e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                        <option value="">Todos os departamentos</option>
                        {departments.map(dep => (
                            <option key={dep.id} value={dep.id}>{dep.name}</option>
                        ))}
                    </select>
                </div>

                {/* Rodapé de Ações */}
                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                    <Button
                        label="Limpar"
                        variant="danger" // Assumindo que existe essa variante, ou use secondary
                        onAction={handleClearFilters}
                    />
                    <Button
                        label="Aplicar Filtros"
                        variant="primary"
                        onAction={handleConfirmFilters}
                    />
                </div>
            </div>
        </div>
    )
}