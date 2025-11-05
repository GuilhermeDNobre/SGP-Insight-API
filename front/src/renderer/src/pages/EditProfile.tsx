import Input from '@components/Input'
import ProfileSide from '@components/ProfileSide'
import Sidebar from '@components/Sidebar'
import { useProfile } from '@hooks/useProfile'

export default function EditProfile(): React.JSX.Element {
  const {
    userData,
    setUserData,
    passwords,
    setPasswords,
    errors,
    isLoading,
    previewImage,
    updateProfile,
    handleImagePreview
  } = useProfile()

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()

    const profilePictureInput = document.getElementById('profile-picture') as HTMLInputElement
    const newProfilePicture = profilePictureInput?.files?.[0]

    try {
      await updateProfile(newProfilePicture)
      alert('Perfil atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
    }
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="flex h-screen bg-(--white)">
      <Sidebar />

      <main className="flex flex-1 flex-col md:flex-row pt-16 md:pt-25 pb-6 md:pb-10 px-4 md:px-8 gap-y-6 md:gap-x-10">
        <ProfileSide />
        <div className="flex flex-col flex-1 w-full max-w-[800px] px-2 md:px-4 py-2 md:py-4 gap-y-4 md:gap-y-5">
          <h1 className="text-2xl font-bold mb-6">Editar Perfil de Usuário</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-y-2">
            {/* Seção de Foto de Perfil */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 mb-4">
                <div
                  className={`w-full h-full rounded-full overflow-hidden border-2 border-(--gray-light) ${!previewImage ? 'bg-(--gray-light)/20' : ''}`}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-(--gray)">
                      Sem foto
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profile-picture"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-(--pri) rounded-full flex items-center justify-center cursor-pointer hover:bg-(--pri)/90 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </label>
                <input
                  type="file"
                  id="profile-picture"
                  accept="image/*"
                  onChange={handleImagePreview}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-(--gray)">Clique no botão + para alterar a foto</p>
            </div>

            <Input
              label="Nome Completo"
              value={userData.fullName}
              labelVariant='default'
              onChange={(e) => setUserData((prev) => ({ ...prev, fullName: e.target.value }))}
              error={errors.fullName}
            />

            <Input
              label="E-mail"
              type="email"
              labelVariant='default'
              value={userData.email}
              onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
              error={errors.email}
            />

            <Input 
              label="CNPJ"
              value={userData.cnpj}
              labelVariant='default'
              disabled className="bg-(--gray-light)/10" 
            />

            <div className="border-t border-(--gray-light) my-6"></div>

            <Input
              label="Senha Atual"
              type="password"
              labelVariant='default'
              value={passwords.currentPassword}
              onChange={(e) =>
                setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
              error={errors.currentPassword}
            />

            <Input
              label="Nova Senha"
              type="password"
              labelVariant='default'
              value={passwords.newPassword}
              onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))}
              error={errors.newPassword}
            />

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-(--sucess) text-white rounded-md hover:scale-105 hover:bg-(--sucess)/80 transition-colors cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
