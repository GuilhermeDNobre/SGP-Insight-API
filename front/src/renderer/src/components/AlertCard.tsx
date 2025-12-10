import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export interface AlertData {
  id: number
  title: string
  subtitle: string
  date: string
  quarter: string
  description: string
}

interface AlertCardProps {
  data: AlertData
  onClick?: () => void
}

export default function AlertCard({ data, onClick }: AlertCardProps): React.JSX.Element {
  const [showDetails, setShowDetails] = useState(false)

  const handleToggle = (e: React.MouseEvent): void => {
    e.stopPropagation()
    setShowDetails(!showDetails)
  }

  return (
    <div 
      className="bg-gray-50 rounded-md shadow-sm border border-gray-200 p-4 flex gap-4 relative overflow-hidden hover:shadow-md transition cursor-pointer group"
      onClick={onClick}
    >
      
      {/* Barra lateral */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--sec)]"></div>

      <div className="flex-1 ml-3">
        {/* Cabeçalho do Card */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-[var(--txt)]">
            {data.title}: <span className="font-normal text-gray-700">{data.subtitle}</span>
          </h3>
          
          {/* Botão do Olho*/}
          <button 
            type="button"
            onClick={handleToggle}
            className="text-gray-400 hover:text-[var(--sec)] transition"
            title={showDetails ? "Esconder detalhes" : "Ver detalhes"}
          >
            {showDetails ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
          <span>{data.date}</span>
          <span>{data.quarter}</span>
        </div>

        {showDetails && (
          <p className="text-sm text-[var(--txt)] leading-relaxed text-gray-600 mt-2 border-t border-gray-200 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
            {data.description}
          </p>
        )}
        
        {!showDetails && (
          <p className="text-xs text-gray-400 italic mt-1">
            Clique no olho para ver a descrição completa...
          </p>
        )}

      </div>
    </div>
  )
}