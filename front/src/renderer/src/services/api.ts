import axios, { AxiosError } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// Request interceptor to attach token if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
    // ignore
  }
  console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
  return config
})

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response:`, response.status, response.data)
    return response
  },
  (error: AxiosError) => {
    console.error('[API] Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    })
    return Promise.reject(error)
  }
)

export default api
