import React from 'react'

interface StartCardProps {
  title: string
  value: string | number 
  icon: React.ReactNode 
  iconColorClass: string
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function StatCard({ title, value, icon, iconColorClass }: StartCardProps){
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col justify-between shadow-sm h-[140px]">
      <div className="flex justify-between items-start">
        <h3 className="text-base font-bold text-[var(--txt)] w-2/3 leading-tight">{title}</h3>
        <div className={`${iconColorClass}`}>{icon}</div>
      </div>
      <span className="text-4xl font-extrabold weight- text-[var(--sec)] self-center mt-2">{value}</span>
    </div>
  )
}