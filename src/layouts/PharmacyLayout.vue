<script setup>
import DashboardShell from './DashboardShell.vue'

const links = [
  { to: '/pharmacie', label: 'Ma pharmacie', icon: 'pharmacy' },
  { to: '/pharmacie/stock', label: 'Mon stock', icon: 'stock' },
  { to: '/pharmacie/historique', label: 'Historique', icon: 'history' },
  { to: '/pharmacie/gardes', label: 'Gardes', icon: 'duty' },
]
</script>

<template>
  <DashboardShell space="Espace pharmacie" :links="links" />
</template>
