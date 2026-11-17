<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BrandLogo from '../components/BrandLogo.vue'

defineProps({
  space: { type: String, required: true },
  links: { type: Array, required: true },
})

const auth = useAuthStore()
const router = useRouter()

// Petites icônes pour le menu latéral
const icons = {
  pharmacy: ['M3 21h18', 'M5 21V7l7-4 7 4v14', 'M9 21v-6h6v6'],
  stock: ['M20 7 12 3 4 7v10l8 4 8-4V7Z', 'm4 7 8 4 8-4', 'M12 11v10'],
  history: ['M3 12a9 9 0 1 0 3-6.7L3 8', 'M3 3v5h5', 'M12 7v5l3 2'],
  duty: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z', 'M12 6v6l4 2'],
  grid: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z'],
  pill: ['M10.5 20.5 3.5 13.5a4.95 4.95 0 0 1 7-7l7 7a4.95 4.95 0 0 1-7 7Z', 'm8.5 8.5 7 7'],
  flag: ['M4 22V4', 'M4 4h13l-2 4 2 4H4'],
  user: ['M20 21a8 8 0 0 0-16 0', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'],
  search: ['M21 21l-4.3-4.3', 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z'],
  default: ['M12 3v18', 'M3 12h18'],
}

const initials = computed(function () {
  const name = (auth.user && auth.user.name) || ''
  return name
    .trim()
    .split(' ')
    .map(function (part) { return part.charAt(0) })
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

async function logout() {
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <div class="shell">
    <aside class="sidebar">
      <BrandLogo light />
      <p class="space-label">{{ space }}</p>

      <nav class="side-nav" aria-label="Menu de l'espace">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="side-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path v-for="d in (icons[link.icon] || icons.default)" :key="d" :d="d" />
          </svg>
          <span>{{ link.label }}</span>
        </RouterLink>

        <RouterLink to="/" class="side-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path v-for="d in icons.search" :key="d" :d="d" />
          </svg>
          <span>Rechercher un médicament</span>
        </RouterLink>
      </nav>

      <div class="side-foot">
        <div class="side-user">
          <span class="side-avatar" aria-hidden="true">{{ initials }}</span>
          <div>
            <p><strong>{{ auth.user.name }}</strong></p>
            <p class="muted">{{ auth.user.email }}</p>
          </div>
        </div>
        <button class="side-logout" @click="logout">Se déconnecter</button>
      </div>
    </aside>

    <div class="shell-main">
      <main class="shell-content"><RouterView /></main>
    </div>
  </div>
</template>
