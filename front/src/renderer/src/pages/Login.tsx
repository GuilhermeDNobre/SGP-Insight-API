import React from 'react'
import Logo from '../assets/icons/Logo.svg'

function Login(): React.JSX.Element {
  return (
    <div className="w-screen h-screen bg-[var(--sec)] flex justify-center items-center">
      <div className="flex flex-col items-center justify-center">
        <img src={Logo} className="w-1/2 mx-auto" alt="Logo SGP" />
        <div className="h-300 w-100 bg-[var(--pri)]"></div>
      </div>
    </div>
  )
}

export default Login
