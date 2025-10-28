import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: React.ReactNode
  variant?: 'primary'
  /**
   * Função que deve retornar os dados atuais dos inputs da página.
   * Será chamada no clique antes de `onAction`.
   */
  collect?: () => unknown
  /**
   * Handler que recebe os dados coletados (se houver) e o evento de clique.
   */
  onAction?: (data: unknown, e?: React.MouseEvent<HTMLButtonElement>) => void
}

function Button({
  label,
  variant = 'primary',
  collect,
  onAction,
  className = '',
  type,
  ...rest
}: ButtonProps): React.JSX.Element {
  const base = 'h-[30px] pl-3.5 pr-3.5 pt-2 pb-2 text-[14px] inline-flex items-center justify-center font-medium rounded transition focus:outline-none cursor-pointer'
  const variants: Record<string, string> = {
    primary: 'bg-[var(--sec)] text-white hover:opacity-90' // Adicionar variantes futuramente
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>):void => {
    const data = collect ? collect() : undefined
    if (onAction) onAction(data, e)
    if (rest.onClick) rest.onClick(e)
  }

  return (
    <button
      type={type ?? 'button'}
      className={`${base} ${variants[variant]} ${className}`}
      onClick={handleClick}
      {...rest}
    >
      {label}
    </button>
  )
}

export default Button