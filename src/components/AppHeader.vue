<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BrandLogo from './BrandLogo.vue'

defineProps({
  links: { type: Array, default: () => [] },
})

const auth = useAuthStore()
const router = useRouter()
const menuOpen = ref(false)

function closeMenu() {
  menuOpen.value = false
}

async function logout() {
  await auth.logout()
  closeMenu()
  router.push('/')
}
</script>

<template>
  <header class="site-header">
    <div class="wrap header-inner">
      <BrandLogo />

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-label="Ouvrir le menu"
        @click="menuOpen = !menuOpen"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path v-if="!menuOpen" d="M4 7h16M4 12h16M4 17h16" />
          <path v-else d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>

      <nav class="nav" :class="{ open: menuOpen }" aria-label="Navigation principale">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="nav-link" @click="closeMenu">
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header-actions" :class="{ open: menuOpen }">
        <template v-if="auth.isLoggedIn">
          <RouterLink :to="auth.homePath" class="btn btn-ghost" @click="closeMenu">Mon espace</RouterLink>
          <button class="btn btn-ghost" @click="logout">Se déconnecter</button>
        </template>
        <template v-else>
          <RouterLink to="/connexion" class="btn btn-ghost" @click="closeMenu">Se connecter</RouterLink>
          <RouterLink to="/inscription" class="btn btn-primary" @click="closeMenu">Créer un compte</RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>
