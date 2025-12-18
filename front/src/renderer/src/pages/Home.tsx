import Button from '@components/Button'
import Sidebar from '@components/Sidebar'
import StatCard from '@components/StatCard'
import api from '@renderer/services/api'
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Monitor,
  PieChart as PieIcon,
  Wrench
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

interface RawDepartmentData {
  name: string
  count: number
}

// Tipos para os dados
interface Stats {
  totalEquipamentos: number
  emManutencao: number
  disponiveis: number
}

interface Departamento {
  name: string
  quantidade: number
  color: string
}

interface StatusEquipamento {
  name: string
  value: number
  color: string
}

interface Alerta {
  id: string
  severity: string
  description: string
}

export default function Home(): React.JSX.Element {
  const navigate = useNavigate()

  // Estados com tipos definidos
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [statusEquipamentos, setStatusEquipamentos] = useState<StatusEquipamento[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [stats, setStats] = useState<Stats>({
    totalEquipamentos: 0,
    emManutencao: 0,
    disponiveis: 0
  })
  const [loading, setLoading] = useState(true)

  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const handleGenerateReport = async (): Promise<void> => {
    try {
      setIsGeneratingReport(true)

      const response = await api.post('/reports/generate', {}, {
        responseType: 'blob' 
      })

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      link.setAttribute('download', `Relatorio-SGP-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
      
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      // alert('Relatório gerado com sucesso!')
    } catch (err: any) {
      console.error(err)
      alert('Erro ao gerar relatório.')
    } finally {
      setIsGeneratingReport(false)
    }
  }

  // Função para buscar dados da API
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        // Assumindo que o token JWT está armazenado em localStorage
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }

        // Chamadas de API (ajuste a base URL se necessário)
        const baseUrl = 'http://localhost:3000'
        const [totalRes, maintRes, availRes, deptRes, statusRes, alertRes] = await Promise.all([
          fetch(`${baseUrl}/equipment/count/equipments`, { headers }),
          fetch(`${baseUrl}/equipment/count/maintenance`, { headers }),
          fetch(`${baseUrl}/equipment/count/equipments/available`, { headers }),
          fetch(`${baseUrl}/equipment/count/departaments`, { headers }),
          fetch(`${baseUrl}/equipment/statistics`, { headers }),
          fetch(`${baseUrl}/alerts?page=1&limit=5`, { headers })
        ])

        const total = await totalRes.json()
        const maint = await maintRes.json()
        const avail = await availRes.json()
        const dept = await deptRes.json()
        const stat = await statusRes.json()
        const alertResponse = await alertRes.json()

        // Processar dados dos departamentos
        const processedDept: Departamento[] = dept.departments.map((d: RawDepartmentData, index: number) => ({
          name: d.name,
          quantidade: d.count,
          color: ['#a78bfa', '#211054', '#7c3aed', '#312e81'][index % 4] // cores cíclicas
        }))

        // Processar dados de status
        const statusMap: Record<string, { name: string; color: string }> = {
          ATIVO: { name: 'Ativo', color: '#4bb06c' },
          EM_MANUTENCAO: { name: 'Em Manutenção', color: '#eeaf57' },
          DESABILITADO: { name: 'Desativado', color: '#b0504b' }
        }
        const processedStat: StatusEquipamento[] = Object.entries(stat).map(([key, value]) => ({
          name: statusMap[key]?.name || key,
          value: value as number,
          color: statusMap[key]?.color || '#3b82f6'
        }))

        setStats({
          totalEquipamentos: total.total ?? 0,
          emManutencao: maint.total ?? 0,
          disponiveis: avail.available ?? 0
        })

        setDepartamentos(processedDept)
        setStatusEquipamentos(processedStat)
        setAlertas(alertResponse.data || [])
        setLoading(false)
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex w-screen h-screen bg-white">
      <Sidebar />

      <main className="flex-1 overflow-y- p-8 bg-white">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Carregando dados...</p>
          </div>
        ) : (
          <>
            <div className="pt-6 h-full flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 pt-6">
                <StatCard
                  title="Total de Equipamentos"
                  value={stats.totalEquipamentos.toString()}
                  icon={<Monitor size={32} />}
                  iconColorClass="text-[var(--ter)]"
                />
                <StatCard
                  title="Em Manutenção"
                  value={stats.emManutencao.toString()}
                  icon={<Wrench size={32} />}
                  iconColorClass="text-[var(--ter)]"
                />
                <StatCard
                  title="Disponíveis"
                  value={stats.disponiveis.toString()}
                  icon={<CheckCircle size={32} />}
                  iconColorClass="text-[var(--ter)]"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6 flex-1 min-h-0">
                <div className="lg:col-span-2 flex flex-col gap-6">
                  {/* Gráfico de Barras */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col h-auto md:h-[345px]">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-[var(--txt)] w-full text-center">
                        Distribuição por departamentos
                      </h3>
                      <BarChart3 className="text-[var(--ter)]" />
                    </div>
                    <div className="flex-1 w-full min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={departamentos}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 12 }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 12 }}
                            tickCount={6}
                            domain={[0, 'dataMax + 10']}
                          />
                          <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                              borderRadius: '8px',
                              border: 'none',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Bar dataKey="quantidade" barSize={50} radius={[4, 4, 0, 0]}>
                            {departamentos.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center mt-4">
                      <Button
                        label="Ver mais detalhes"
                        variant="primary"
                        className="px-6"
                        onClick={() => navigate('/departments')}
                      />
                    </div>
                  </div>

                  {/* Gráfico de Pizza */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col h-auto md:h-[345px]">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-[var(--txt)] w-full text-center">
                        Status do Equipamento
                      </h3>
                      <PieIcon className="text-[var(--ter)]" />
                    </div>
                    <div className="flex-1 w-full min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusEquipamentos as any}
                            cx="50%"
                            cy="50%"
                            innerRadius={0}
                            outerRadius={80}
                            paddingAngle={0}
                            dataKey="value"
                          >
                            {statusEquipamentos.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend
                            verticalAlign="middle"
                            align="right"
                            layout="vertical"
                            iconType="circle"
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center mt-4">
                      <Button
                        label="Ver mais detalhes"
                        variant="primary"
                        className="px-6"
                        onClick={() => navigate('/equipments')}
                      />
                    </div>
                  </div>
                </div>

                {/* Alertas */}
                <div className="flex flex-col gap-6">
                  <div className="lg:col-span-1 bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col min-h-0">
                    <div className="flex justify-between items-center pb-6">
                      <h3 className="text-xl font-bold text-[var(--txt)]">Alertas</h3>
                      <AlertTriangle className="text-[var(--atencio)] opacity-80" size={24} />
                    </div>

                    <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2">
                      {alertas.map((alert) => (
                        <div
                          key={alert.id}
                          className="bg-yellow-50 border border-yellow-100 rounded-lg p-4"
                        >
                          <h4 className="text-xs font-bold text-[var(--atencio)] uppercase mb-1">
                            {alert.severity || 'Alerta'}
                          </h4>
                          <p className="text-sm text-gray-700 leading-snug">{alert.description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center mt-6 pt-4 border-t border-gray-100">
                      <Button
                        label="Ver todos os alertas"
                        className="w-full bg-[var(--atencio)] text-white hover:opacity-90"
                        onClick={() => navigate('/alerts')}
                      />
                    </div>
                  </div>

                  <Button
                    label={isGeneratingReport ? 'Gerando...' : 'Gerar Relatorio'}
                    variant="primary"
                    className="px-6"
                    disabled={isGeneratingReport}
                    onClick={handleGenerateReport}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}