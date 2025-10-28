import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function Input({
  label,
  type = 'text',
  error,
  className = '',
  ...props
}: InputProps): React.JSX.Element {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="flex flex-col w-full">
      <label className="text-base font-semibold">{label}</label>

      <div className="relative">
        <input
          {...props}
          type={isPassword && showPassword ? 'text' : type}
          className={`w-full rounded-md bg-(--white) border border-(--black) px-3 py-2 text-sm
          text-(--black) placeholder:(--gray)
          focus:outline-none focus:ring-2 focus:ring-(--pri) focus:border-(--pri)
          hover:border-(--pri) transition-colors ${className}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-(--gray) hover:text-(--pri) transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-(--err) mt-1">{error}</p>}
    </div>
  )
}
