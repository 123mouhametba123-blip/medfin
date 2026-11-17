import { defineStore } from 'pinia'
import { loginRequest, registerRequest, meRequest, logoutRequest } from '../api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
  }),

  getters: {
    isLoggedIn: (state) => state.token !== null && state.user !== null,
    role: (state) => (state.user ? state.user.role : null),
    homePath() {
      if (this.role === 'admin') return '/admin'
      if (this.role === 'pharmacy') return '/pharmacie'
      if (this.role === 'patient') return '/patient'
      return '/'
    },
  },

  actions: {
    setSession(data) {
      this.token = data.token
      this.user = data.user
      localStorage.setItem('token', data.token)
    },

    async login(email, password) {
      const response = await loginRequest({ email, password })
      this.setSession(response.data)
    },

    async register(form) {
      const response = await registerRequest(form)
      this.setSession(response.data)
    },

    // Recharge l'utilisateur à partir du token (après un rafraîchissement de page)
    async fetchMe() {
      if (this.token === null) return
      try {
        const response = await meRequest()
        this.user = response.data.data
      } catch (error) {
        this.clear()
      }
    },

    async logout() {
      try {
        await logoutRequest()
      } catch (error) {
        // Même si l'API échoue, on déconnecte côté navigateur
      }
      this.clear()
    },

    clear() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },
  },
})
