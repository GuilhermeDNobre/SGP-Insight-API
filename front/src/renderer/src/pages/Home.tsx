import Sidebar from '@components/Sidebar'
import React from 'react'
import StatCard from '@components/StatCard'
import Button from '@components/Button'
import { Monitor, Wrench, CheckCircle, AlertTriangle, BarChart3, PieChart as PieIcon} from 'lucide-react'
import { BarChart, Bar, YAxis, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts'
import { useNavigate } from 'react-router-dom'

// Dados Mockados
const DATA_DEPARTAMENTOS = [
  { name: 'Dep. A', quantidade: 280, color : '#a78bfa'},
  { name: 'Dep. B', quantidade: 200, color : '#211054' },
  { name: 'Dep. C', quantidade: 320, color : '#7c3aed' },
  { name: 'Dep. D', quantidade: 410, color : '#312e81' },
]

// Novos dados para gráfico pizza
const DATA_STATUS = [
  { name: 'Ativo', value: 454, color: '#4bb06c' },
  { name: 'Disponível', value: 705, color: '#3b82f6' },
  { name: 'Em Manutenção', value: 429, color: '#eeaf57' },
  { name: 'Desativado', value: 298, color: '#b0504b' },
]

// Dados visuais do protótipo de alertas
const DATA_ALERTAS = [
  { id: 1, title: 'Recorrência', desc: 'Notebook Dell (ID: 123) apresentou defeito 3x este mês no Departamento X.'},
  { id: 2, title: 'Recorrência', desc: 'Notebook Dell (ID: 123) apresentou defeito 3x este mês no Departamento X.'},
  { id: 3, title: 'Recorrência', desc: 'Notebook Dell (ID: 123) apresentou defeito 3x este mês no Departamento X.'},
  { id: 4, title: 'Recorrência', desc: 'Notebook Dell (ID: 123) apresentou defeito 3x este mês no Departamento X.'},
  { id: 5, title: 'Recorrência', desc: 'Notebook Dell (ID: 123) apresentou defeito 3x este mês no Departamento X.'},
]

export default function Home(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <div className="flex w-screen h-screen bg-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8 bg-white">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-6">
          <StatCard
            title="Total de Equipamentos"
            value="200"
            icon={<Monitor size={32} />}
            iconColorClass="text-[var(--ter)]"
          />
          <StatCard
            title="Em Manutenção"
            value="35"
            icon={<Wrench size={32} />}
            iconColorClass="text-[var(--ter)]"
          />
          <StatCard
            title="Disponíveis"
            value="42"
            icon={<CheckCircle size={32} />}
            iconColorClass="text-[var(--ter)]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">

          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Gráfico de Barras */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col h-[380px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[var(--txt)] w-full text-center">Distribuição por departamentos</h3>
                <BarChart3 className="text-[var(--ter)]" />
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DATA_DEPARTAMENTOS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} ticks={[0, 150, 300, 450, 600]} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} />
                    <Bar dataKey="quantidade" barSize={50} radius={[4, 4, 0, 0]}>
                      {DATA_DEPARTAMENTOS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-4">
                <Button label="Ver mais detalhes" variant="primary" className="px-6" onClick={() => navigate('/departments')} />
              </div>
            </div>

            {/* Gráfico de Pizza */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col h-[380px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[var(--txt)] w-full text-center">Status do Equipamento</h3>
                <PieIcon className="text-[var(--ter)]" />
              </div>
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DATA_STATUS}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {DATA_STATUS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-4">
                <Button label="Ver mais detalhes" variant="primary" className="px-6" onClick={() => navigate('/equipments')} />
              </div>
            </div>
          </div>

          {/* Alertas */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-center pb-6">
              <h3 className="text-xl font-bold text-[var(--txt)]">Alertas</h3>
              <AlertTriangle className="text-[var(--atencio)] opacity-80" size={24} />
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2">
              {DATA_ALERTAS.map((alert) => (
                <div key={alert.id} className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-[var(--atencio)] uppercase mb-1">{alert.title}</h4>
                  <p className="text-sm text-gray-700 leading-snug">{alert.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
              <Button
                label="Ver todos os alertas"
                className="w-full bg-[var(--atencio)] text-white hover:opacity-90"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}