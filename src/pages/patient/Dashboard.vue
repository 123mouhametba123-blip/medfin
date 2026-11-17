<script setup>
import { useAuthStore } from '../../stores/auth'
import { useSearchStore } from '../../stores/search'

const auth = useAuthStore()
const search = useSearchStore()
</script>

<template>
  <h1>Bonjour {{ auth.user.name }}</h1>

  <section class="card">
    <h2>Vos dernières recherches</h2>

    <p v-if="search.history.length === 0" class="empty">
      Vous n'avez pas encore fait de recherche.
      <RouterLink to="/">Chercher un médicament</RouterLink>
    </p>

    <ul v-else class="list">
      <li v-for="(item, index) in search.history" :key="index">
        <RouterLink :to="{ path: '/', query: { q: item.q, city: item.city, neighborhood: item.neighborhood } }">
          {{ item.q }}<span v-if="item.city" class="muted"> — {{ item.city }}</span><span v-if="item.neighborhood" class="muted">, {{ item.neighborhood }}</span>
        </RouterLink>
      </li>
    </ul>
  </section>

  <section class="card">
    <h2>Mon compte</h2>
    <p>{{ auth.user.email }}</p>
    <p v-if="auth.user.phone">{{ auth.user.phone }}</p>
  </section>
</template>
