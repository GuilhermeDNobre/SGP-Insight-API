import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";

interface AddComponentModalProps {
  isOpen: boolean
  onClose: () => void
  onAddComponent: (data: { tipo: string; modelo: string }) => void
}

export default function AddComponentModal({
  isOpen,
  onClose,
  onAddComponent
}: AddComponentModalProps): React.JSX.Element | null {
  const [tipo, setTipo] = useState('')
  const [modelo, setModelo] = useState('')
  const [error, setError] = useState('')

  // Não renderiza nada se estiver fechado
  if (!isOpen) {
    return null
  }

  // Coleta os dados para o <Button>
  const collectData = (): { tipo: string; modelo: string } => {
    return { tipo, modelo }
  }

  // Ação do <Button>
  const handleAction = (data: unknown): void => {
    // 1. Verificação de Tipo (Type Guard)
    if (typeof data !== 'object' || data === null) {
      console.error('Tipo de dado inesperado:', data);
      setError('Um erro inesperado ocorreu.');
      return;
    }

    // 2. Agora que sabemos que é um objeto, verificamos as propriedades
    if ('tipo' in data && 'modelo' in data) {
      
      // 3. Como 'tipo' e 'modelo' existem, podemos converter o tipo com segurança
      const componentData = data as { tipo: string; modelo: string };

      // 4. Validação simples
      if (!componentData.tipo || !componentData.modelo) {
        setError('Ambos os campos são obrigatórios.');
        return;
      }

      // 5. Envia os dados para a página pai
      onAddComponent(componentData);
      
      // 6. Limpa o formulário e fecha o modal
      setTipo('');
      setModelo('');
      setError('');
      onClose();

    } else {
      // Isso não deve acontecer se a função 'collectData' estiver correta
      console.error('Propriedades ausentes nos dados:', data);
      setError('Erro ao coletar dados do formulário.');
    }
  };

  // Lida com o clique no "Cancelar" ou no overlay
  const handleClose = (): void => {
    setTipo('')
    setModelo('')
    setError('')
    onClose()
  }

  return (
    // Overlay (fundo escuro)
    <div 
      className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleClose} // Clica fora para fechar
    >
      {/* Container do Modal (impede que o clique feche) */}
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()} // Impede propagação do clique
      >
        <h3 className="text-xl font-semibold text-gray-900">Adicionar Componente</h3>

        {/* Formulário */}
        <Input
          label="Tipo de Componente"
          labelVariant="default"
          placeholder="Ex: Processador"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />
        <Input
          label="Modelo"
          labelVariant="default"
          placeholder="Ex: Intel Core i7-12700K"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
        />

        {/* Exibe erro de validação */}
        {error && <p className="text-xs text-[var(--erro)]">{error}</p>}

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancelar"
            variant="secondary" // Você precisará criar essa variante no seu Button.tsx
            onClick={handleClose}
          />
          <Button
            label="Adicionar"
            variant="primary"
            collect={collectData}
            onAction={handleAction}
          />
        </div>
      </div>
    </div>
  )
}