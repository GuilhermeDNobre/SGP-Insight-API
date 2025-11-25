import api from '../services/api'

export function useAuth(): {
  login: (email: string, password: string) => Promise<string>
  logout: () => void
  getToken: () => string | null
} {
  const login = async (email: string, password: string): Promise<string> => {
    try {
      const res = await api.post('/auth/login', {
        email,
        password
      })

      const token = res.data as string
      if (typeof token === 'string') {
        try {
          localStorage.setItem('token', token)
        } catch {
          // ignore storage errors in some electron contexts
        }
      }
      return token
    } catch (error: unknown) {
      let errMsg = 'Login falhou'

      // Handle axios errors
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object'
      ) {
        const response = error.response as Record<string, unknown>
        const status = response.status
        const data = response.data

        if (status === 401) {
          errMsg = 'Email ou senha inválidos'
        } else if (status === 400) {
          if (
            data &&
            typeof data === 'object' &&
            'message' in data &&
            typeof (data as Record<string, unknown>).message === 'string'
          ) {
            errMsg = (data as Record<string, unknown>).message as string
          } else {
            errMsg = 'Dados inválidos'
          }
        } else if (
          data &&
          typeof data === 'object' &&
          'message' in data &&
          typeof (data as Record<string, unknown>).message === 'string'
        ) {
          errMsg = (data as Record<string, unknown>).message as string
        }
      } else if (error instanceof Error) {
        errMsg = error.message
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errMsg = (error as Record<string, unknown>).message as string
      }

      throw new Error(errMsg)
    }
  }

  const logout = (): void => {
    try {
      localStorage.removeItem('token')
    } catch {
      // ignore
    }
  }

  const getToken = (): string | null => {
    try {
      return localStorage.getItem('token')
    } catch {
      return null
    }
  }

  return { login, logout, getToken }
}

export default useAuth
