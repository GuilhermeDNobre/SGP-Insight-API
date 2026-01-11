import Logo from '@assets/icons/Logo.svg'
import Input from '@components/Input'
import { useAuth } from '@hooks/useAuth'
import Button from '@renderer/components/Button'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login(): React.JSX.Element {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido'
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (password.length < 4) {
      newErrors.password = 'Senha deve ter pelo menos 4 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)
      await login(email, password)
      // Se chegou aqui, o login foi bem-sucedido
      navigate('/Home')
    } catch (error) {
      setErrors({
        password: error instanceof Error ? error.message : 'Erro ao fazer login'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="w-screen h-screen bg-(--sec) flex-col flex justify-center items-center relative gap-9">
      <div className="">
        <img src={Logo} alt="Logo SGP" className="w-80" />
      </div>

      <div className="w-80 pl-5 pr-5 pb-4 pt-4 bg-(--pri) flex-col flex justify-center items-center rounded-[0.625rem] gap-2.5">
        <div className=" text-white font-medium text-2xl">Seja bem-vindo (a)!</div>

        <Input
          label="E-mail"
          type="email"
          placeholder="admin@example.com"
          labelVariant="white"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
          }}
          error={errors.email}
          className="bg-(--white)"
        />

        <Input
          label="Senha:"
          type="password"
          placeholder="Insira sua senha"
          labelVariant="white"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
          }}
          error={errors.password}
          className="bg-(--white)"
        />

        <Button
          label={isLoading ? 'Entrando...' : 'Entrar'}
          variant="primary"
          type="button"
          disabled={isLoading}
          onClick={handleSubmit}
        />
      </div>
    </form>
  )
}

export default Login
