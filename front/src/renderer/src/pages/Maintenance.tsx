import Sidebar from '@components/Sidebar'

export default function Maintenance(): React.JSX.Element {
  return (
    <div className="w-screen h-screen bg-[var(--white)] flex justify-center items-center relative">
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Conteúdo central da página */}
      <div className="flex w-[1400px] pb-[21px] flex-col items-center gap-2.5">
        <div className="font-bold text-[32px] leading-normal">
          Buscar Manuntenções
        </div>
      </div>
    </div>
  )
}
