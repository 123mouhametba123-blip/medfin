import { defineStore } from 'pinia'
import { searchStocks } from '../api/public'

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem('search_history')) || []
  } catch (e) {
    return []
  }
}

export const useSearchStore = defineStore('search', {
  state: () => ({
    q: '',
    city: '',
    neighborhood: '',
    onDuty: false,
    latitude: null,
    longitude: null,
    results: [],
    loading: false,
    searched: false,
    error: '',
    history: loadHistory(), // dernières recherches (5 max)
  }),

  actions: {
    async search() {
      this.loading = true
      this.error = ''
      try {
        const response = await searchStocks({
          q: this.q,
          city: this.city,
          neighborhood: this.neighborhood,
          on_duty: this.onDuty ? 1 : '',
          latitude: this.latitude,
          longitude: this.longitude,
        })
        this.results = response.data.data
        this.searched = true
        this.remember()
      } catch (error) {
        this.error = 'La recherche a échoué. Réessayez dans un instant.'
        this.results = []
      } finally {
        this.loading = false
      }
    },

    remember() {
      const terme = this.q.trim()
      if (terme === '') return

      // On retire le doublon éventuel puis on met la recherche en premier
      this.history = this.history.filter(
        (item) => item.q !== terme || item.city !== this.city || item.neighborhood !== this.neighborhood
      )
      this.history.unshift({ q: terme, city: this.city, neighborhood: this.neighborhood })
      this.history = this.history.slice(0, 5)
      localStorage.setItem('search_history', JSON.stringify(this.history))
    },
  },
})
