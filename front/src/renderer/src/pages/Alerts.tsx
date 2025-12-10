import React, { useState } from 'react'
import Sidebar from '@components/Sidebar'
import Input from '@components/Input'
import Button from '@components/Button'
import AlertCard, { AlertData } from '@components/AlertCard'
import AlertModal from '@components/AlertModal'
import { ListFilter, ChevronLeft, ChevronRight } from 'lucide-react'

const MOCK_ALERTS: AlertData[] = [
  {
    id: 1,
    title: 'Recorrência 2',
    subtitle: 'Notebook Dell (ID: 123)',
    date: '24/11/2025',
    quarter: '4º Trimestre',
    description: 'Falha no componente SSD ocorrida 3x nos últimos 3 meses no Departamento X.'
  },
  {
    id: 2,
    title: 'Recorrência 1',
    subtitle: 'Impressora HP (ID: 124)',
    date: '10/11/2025',
    quarter: '4º Trimestre',
    description: 'Falha no componente Toner ocorrida 2x nos últimos 3 meses no Departamento X.'
  },
  {
    id: 3,
    title: 'Tipo de Alerta',
    subtitle: 'Equipamento X',
    date: 'DD/MM/YYYY',
    quarter: 'Nº Trimestre',
    description: 'Lorem ipsum dolor sit amet consectetur. Sit rhoncus vitae sodales elit. Sed neque orci mauris tortor.'
  },
  {
    id: 4,
    title: 'Tipo de Alerta',
    subtitle: 'Equipamento X',
    date: 'DD/MM/YYYY',
    quarter: 'Nº Trimestre',
    description: 'Lorem ipsum dolor sit amet consectetur. Sit rhoncus vitae sodales elit. Sed neque orci mauris tortor.'
  },
]

export default function Alerts(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  
  const filteredAlerts = MOCK_ALERTS.filter(alert => 
    alert.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <div className="flex w-screen h-screen bg-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-10 bg-white ml-14">
        
        {/* Cabeçalho */}
        <div className="flex flex-col gap-4 mb-6 pt-10">
          <h1 className="text-2xl font-bold text-[var(--txt)]">Alertas</h1>

          {/* Barra de Busca, Botão Filtrar */}
          <div className="flex gap-2 w-full">
            <Input 
              labelVariant="default"
              type="search"
              placeholder="Digite o Departamento, Equipamento ou Componente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-[38px] flex-1"
            />
            <Button 
              label="Filtrar"
              variant="primary"
              endIcon={<ListFilter size={16} />}
              className="h-[38px]"
              onClick={() => setIsFilterModalOpen(true)}
            />
          </div>
          
          <p className="text-sm text-gray-500">
            Alertas Encontrados: {filteredAlerts.length}
          </p>
        </div>
        {/* Lista de Alertas */}
        <div className="flex flex-col gap-4 mb-8">
          {filteredAlerts.map((alert) => (
            <AlertCard 
              key={alert.id} 
              data={alert} 
              onClick={() => console.log('Abrir detalhes do alerta', alert.id)} 
            />
          ))}
          
          {filteredAlerts.length === 0 && (
            <div className="text-center text-gray-400 py-10 border border-dashed border-gray-300 rounded-lg">
              Nenhum alerta encontrado com esses critérios.
            </div>
          )}
        </div>

        {/* Paginação */}
        <div className="flex justify-end items-center gap-2 pb-10">
            <button className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 text-gray-600 disabled:opacity-50">
                <ChevronLeft size={16} />
            </button>
            
            <button className="w-8 h-8 flex items-center justify-center bg-[var(--sec)] text-white rounded font-bold transition">1</button>
            <button className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50 text-gray-600 transition">2</button>
            <button className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50 text-gray-600 transition">3</button>
            
            <button className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 text-gray-600">
                <ChevronRight size={16} />
            </button>
        </div>

      </main>

      {/* Modal de Filtro */}
      <AlertModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
      />
    </div>
  )
}