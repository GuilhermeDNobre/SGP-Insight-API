import Sidebar from '@components/Sidebar'

export default function Home(): React.JSX.Element {
  return (
    <div className="w-screen h-screen bg-(--sec) flex justify-center items-center relative">
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Conteúdo central da página */}
      <div className="z-10 text-white text-3xl font-bold">Página Principal</div>
    </div>
  )
}
