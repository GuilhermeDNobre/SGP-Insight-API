import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success'
  endIcon?: React.ReactNode
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
  endIcon,
  collect,
  onAction,
  className = '',
  type,
  ...rest
}: ButtonProps): React.JSX.Element {
  const base = 'h-[30px] pl-3.5 pr-3.5 pt-2 pb-2 text-[14px] gap-2 inline-flex items-center justify-center font-medium rounded transition focus:outline-none cursor-pointer'
  const variants: Record<string, string> = {
    primary: 'bg-[var(--sec)] text-white hover:opacity-90', // Adicionar variantes futuramente
    secondary: 'bg-[var(--white)] text-[var(--sec)] border border-[var(--sec)] hover:bg-[var(--sec)] hover:text-white',
    danger: 'bg-[var(--erro)] text-white hover:bg-[var(--pri)]/80',
    success: 'bg-[var(--sucess)] text-white hover:bg-[var(--sucess)]/80',
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
      {label && <span>{label}</span>}
      {endIcon && <span>{endIcon}</span>}
    </button>
  )
}

export default Button