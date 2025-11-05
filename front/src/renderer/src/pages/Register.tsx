import React from 'react'
import Logo from '@assets/icons/Logo.svg'
import { useNavigate } from 'react-router-dom'

function Register(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <form className="w-screen h-screen bg-[var(--sec)] flex-col flex justify-center items-center relative gap-9">
      <div className="">
        <img src={Logo} alt="Logo SGP" className="w-80" />
      </div>

      <div className="w-80 pl-5 pr-5 pb-4 pt-4 bg-[var(--pri)] flex-col flex justify-center items-center rounded-[0.625rem] gap-2.5">
        <div className=" text-white font-medium text-2xl">Seja Bem-Vindo (a)</div>

        <div className='text-[12px] text-white'>
          Já é cadastrado? Entre{" "}
          <a href='' className='text-[var(--ter)]' onClick={() => {
            navigate("/")
          }}> 
            aqui. 
          </a>
        </div>
      </div>
    </form>
  )
}

export default Register