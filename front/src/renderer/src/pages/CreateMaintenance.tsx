import { useDepartment } from '@hooks/useDepartment'
import Button from '@renderer/components/Button'
import Input from '@renderer/components/Input'
import Sidebar from '@renderer/components/Sidebar'
import { useSnackbar } from '@renderer/context/SnackbarContext'
import { useProfile } from '@renderer/hooks/useProfile'
import api from '@renderer/services/api'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface EquipmentOption {
  id: string
  name: string
  ean: string
}

interface ComponentOption {
  id: string
  name: string
}

export default function CreateMaintenance(): React.JSX.Element {
  const navigate = useNavigate()
  const { showSnackbar } = useSnackbar()
  const { departments, loadDepartments } = useDepartment()
  const { userData } = useProfile()
  const isAdmin = userData?.role === 'ADMIN'

  // Estados do formulário
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedEquip, setSelectedEquip] = useState('')
  const [technician, setTechnician] = useState('')
  const [description, setDescription] = useState('')
  const [selectedComponents, setSelectedComponents] = useState<string[]>([])
  const [isExternal, setIsExternal] = useState(false)

  // Estados de dados
  const [equipmentsList, setEquipmentsList] = useState<EquipmentOption[]>([])
  const [componentsList, setComponentsList] = useState<ComponentOption[]>([])
  const [loadingEquips, setLoadingEquips] = useState(false)

  // Carrega departamentos
  useEffect(() => {
    void loadDepartments()
  }, [])

  // Se NÃO for admin, define automaticamente o responsável
  useEffect(() => {
    if (userData?.role !== 'ADMIN' && userData?.firstName) {
      setTechnician(userData.firstName)
    }
  }, [userData])

  // Carrega equipamentos
  useEffect(() => {
    if (!selectedDept) {
      setEquipmentsList([])
      return
    }

    const fetchEquips = async (): Promise<void> => {
      setLoadingEquips(true)
      try {
        const res = await api.get(`/equipment?alocatedAtId=${selectedDept}&limit=100`)
        setEquipmentsList(res.data.data)
      } catch (error) {
        showSnackbar(`Erro ao carregar equipamentos. "${error}"`, 'error')
      } finally {
        setLoadingEquips(false)
      }
    }

    fetchEquips()
    setSelectedEquip('')
    setComponentsList([])
  }, [selectedDept])

  // Carrega componentes
  useEffect(() => {
    if (!selectedEquip) {
      setComponentsList([])
      return
    }

    const fetchComps = async (): Promise<void> => {
      try {
        const res = await api.get(`/components/equipment/${selectedEquip}`)
        setComponentsList(res.data)
      } catch (error) {
        showSnackbar(`Erro ao carregar componentes. "${error}"`, 'error')
      }
    }

    fetchComps()
    setSelectedComponents([])
  }, [selectedEquip])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    if (!selectedEquip || !description || !technician) {
      showSnackbar('Preencha os campos obrigatórios', 'warning')
      return
    }

    try {
      await api.post('/maintenance', {
        equipmentId: selectedEquip,
        technician,
        description,
        componentIds: selectedComponents
      })

      showSnackbar('Manutenção aberta com sucesso!', 'success')
      navigate('/maintenance')
    } catch (error) {
      showSnackbar(`Erro ao criar manutenção. "${error}"`, 'error')
    }
  }

  const toggleComponent = (id: string): void => {
    setSelectedComponents((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  return (
    <div className="w-screen h-screen bg-(--white) flex justify-center items-center relative">
      <Sidebar />

      <main className="flex w-[1200px] pb-[21px] overflow-hidden flex-col items-center gap-2.5">
        <div className="flex w-full max-w-4xl shrink-0 flex-col gap-6 rounded-lg bg-white p-8 shadow-lg">
          <div className="border-b border-gray-100 shrink-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nova Manutenção</h2>
            <p className="text-sm text-gray-500">Registre a abertura de um chamado para reparo.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              {/* Departamento / Equipamento */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">1. Departamento</label>
                  <select
                    className="border rounded p-2 text-sm"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold">2. Equipamento</label>
                  <select
                    className="border rounded p-2 text-sm"
                    value={selectedEquip}
                    onChange={(e) => setSelectedEquip(e.target.value)}
                    disabled={!selectedDept}
                  >
                    <option value="">{loadingEquips ? 'Carregando...' : 'Selecione...'}</option>
                    {equipmentsList.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} - {e.ean}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Componentes */}
              <div className="border p-4 rounded-lg bg-gray-50">
                <label className="text-sm font-semibold mb-2 block">
                  3. Componentes Afetados (Opcional)
                </label>

                {componentsList.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">
                    Selecione um equipamento para ver os componentes.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {componentsList.map((comp) => (
                      <label
                        key={comp.id}
                        className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-100 p-1 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedComponents.includes(comp.id)}
                          onChange={() => toggleComponent(comp.id)}
                        />
                        {comp.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Responsável */}
              <div className="flex flex-col gap-3">
                {isAdmin && (
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="checkbox"
                      checked={isExternal}
                      onChange={(e) => {
                        const checked = e.target.checked
                        setIsExternal(checked)

                        if (checked) {
                          setTechnician('')
                        } else if (!isAdmin && userData?.firstName) {
                          setTechnician(userData.firstName)
                        }
                      }}
                    />
                    Manutenção externa
                  </label>
                )}

                <Input
                  label={isExternal ? 'Empresa Responsável' : 'Responsável Técnico'}
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                  disabled={!isExternal && userData?.role !== 'ADMIN'}
                  placeholder={isExternal ? 'Nome da empresa' : ''}
                  labelVariant="default"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold">Descrição do Problema</label>
                <textarea
                  className="border rounded p-2 text-sm h-24 resize-none focus:ring-2 ring-blue-500 outline-none"
                  placeholder="Descreva o defeito detalhadamente..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6 justify-end">
              <Button
                label="Cancelar"
                variant="secondary"
                onClick={() => navigate('/maintenance')}
              />
              <Button label="Abrir Chamado" type="submit" variant="success" />
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
