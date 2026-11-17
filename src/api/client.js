import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { Accept: 'application/json' },
})

// Ajoute le token de connexion à chaque requête
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
})

// Si le token n'est plus valide (401), on nettoie et on renvoie vers la connexion
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null
    const hadToken = localStorage.getItem('token')

    if (status === 401 && hadToken) {
      localStorage.removeItem('token')
      window.location.href = '/connexion'
    }
    return Promise.reject(error)
  }
)

export default client
