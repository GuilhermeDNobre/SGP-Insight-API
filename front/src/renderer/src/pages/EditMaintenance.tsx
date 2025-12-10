import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMaintenance } from '@hooks/useMaintenance'
import { useSnackbar } from '@renderer/context/SnackbarContext'
import Sidebar from '@renderer/components/Sidebar'
import Input from '@renderer/components/Input'

export default function EditMaintenance(): React.JSX.Element {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { showSnackbar } = useSnackbar()
  
  const { 
    loadMaintenanceById, 
    updateMaintenance, 
    maintenance, 
    isLoading 
  } = useMaintenance()

  const [technician, setTechnician] = useState('')
  const [description, setDescription] = useState('')

  // 1. Carrega dados
  useEffect(() => {
    if (id) {
      void loadMaintenanceById(id)
    }
  }, [id, loadMaintenanceById])

  // 2. Preenche formulário
  useEffect(() => {
    if (maintenance) {
      // Regra de Negócio: Se estiver fechada, não pode editar
      if (maintenance.status === 'TERMINADA') {
        showSnackbar('Esta manutenção já foi encerrada.', 'warning')
        navigate('/maintenance')
        return
      }

      setTechnician(maintenance.technician)
      setDescription(maintenance.description)
    }
  }, [maintenance, navigate, showSnackbar])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!id) return

    if (!technician.trim() || !description.trim()) {
      showSnackbar('Preencha os campos obrigatórios.', 'warning')
      return
    }

    try {
      await updateMaintenance(id, {
        technician,
        description
      })
      showSnackbar('Manutenção atualizada com sucesso!', 'success')
      navigate('/maintenance')
    } catch (error) {
      showSnackbar(`Erro ao atualizar manutenção. ${error}`, 'error')
    }
  }

  if (isLoading || !maintenance) {
    return (
      <div className="flex w-screen h-screen bg-gray-100 items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen bg-(--white) flex justify-center items-center relative">
      <Sidebar />

      <main className="flex w-[1200px] pb-[21px] overflow-hidden flex-col items-center gap-2.5">
        
        {/* Card Fixo */}
        <div className="flex w-full max-w-4xl shrink-0 flex-col gap-6 rounded-lg bg-white p-8 shadow-lg">
          
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Manutenção</h2>
            <p className="text-sm text-gray-500 mt-1">Atualize as informações do chamado.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              
              {/* Informações Fixas (Apenas Leitura) */}
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h4 className="text-xs font-bold text-blue-800 uppercase mb-2">Equipamento Vinculado</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-blue-900">
                   <p><span className="font-semibold">Modelo:</span> {maintenance.equipment?.name}</p>
                   <p><span className="font-semibold">EAN:</span> {maintenance.equipment?.ean}</p>
                </div>
              </div>

              {/* Campos Editáveis */}
              <Input 
                label="Responsável Técnico" 
                value={technician} 
                onChange={e => setTechnician(e.target.value)} 
                placeholder="Nome do técnico"
                labelVariant="default"
              />
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Descrição do Problema</label>
                <textarea 
                  className="border rounded p-2 text-sm h-48 resize-none focus:ring-2 ring-blue-500 outline-none"
                  placeholder="Descreva o defeito detalhadamente..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

            </div>

            {/* --- Rodapé --- */}
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/maintenance')}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition"
              >
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}