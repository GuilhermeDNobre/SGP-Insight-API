import ProfileSide from '@components/ProfileSide'
import Sidebar from '@components/Sidebar'

export default function EditProfile(): React.JSX.Element {
  return (
    <div className="flex h-screen bg-(--white)">
      {/* Sidebar */}
      <Sidebar />

      {/* Conteúdo Principal */}
      <main className="flex-1 pt-25 pb-10 px-8">
        <ProfileSide />
      </main>
    </div>
  )
}
