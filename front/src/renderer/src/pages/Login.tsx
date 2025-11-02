import React from 'react'
import Logo from '@assets/icons/Logo.svg'
import Input from '@components/Input'
import { useProfile } from '@hooks/useProfile'
import Button from '@renderer/components/Button'
import { useNavigate } from 'react-router-dom'

function Login(): React.JSX.Element {
  const {
    userData,
    setUserData,
    passwords,
    setPasswords,
    errors
  } = useProfile()
  
  const navigate = useNavigate()
  
  return (
    <form className="w-screen h-screen bg-[var(--sec)] flex-col flex justify-center items-center relative gap-9">
      <div className="">
        <img src={Logo} alt="Logo SGP" className="w-80" />
      </div>

      <div className="w-80 pl-5 pr-5 pb-4 pt-4 bg-[var(--pri)] flex-col flex justify-center items-center rounded-[0.625rem] gap-2.5">
        <div className=" text-white font-medium text-2xl">Seja bem-vindo!</div>
        
        <Input
          label="E-mail"
          type="email"
          labelVariant='white'
          value={userData.email}
          onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
          error={errors.email}
          className='bg-(--white)'
        />

        <Input
          label="Senha:"
          type="password"
          labelVariant='white'
          value={passwords.currentPassword}
          onChange={(e) =>
            setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))
          }
          error={errors.currentPassword}
          className='bg-(--white)'
        />

        <Button
          label="Entrar"
          variant="primary"
          type='submit'
          collect={() => 
            ({
              email: userData.email,
              password: passwords.currentPassword
            })
          } // Faltam dados para coletar
          onAction={(data) => {
            console.log('Dados de login: ', data)
            // Chamar login handler
            navigate("/Home")
          }}
        />

        <div className='text-[12px] text-white'>
          Ainda não é cadastrado? Cadastre-se{" "}
          <a href='' className='text-[var(--ter)]' onClick={() => {
            //navigate("/Register")
          }}> 
            aqui. 
          </a>
        </div>
      </div>
    </form>
  )
}

export default Login
