export interface StatusOption {
  value: string;
  label: string;
}

export const MOCKED_STATUSES: StatusOption[] = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'disponivel', label: 'Disponível' },
  { value: 'manutencao', label: 'Em Manutenção' },
  { value: 'indisponivel', label: 'Indisponível' },
];