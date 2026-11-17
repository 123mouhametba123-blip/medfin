<script setup>
import DashboardShell from './DashboardShell.vue'

const links = [
  { to: '/admin', label: 'Tableau de bord', icon: 'grid' },
  { to: '/admin/pharmacies', label: 'Pharmacies', icon: 'pharmacy' },
  { to: '/admin/medicaments', label: 'Médicaments', icon: 'pill' },
  { to: '/admin/signalements', label: 'Signalements', icon: 'flag' },
]
</script>

<template>
  <DashboardShell space="Administration" :links="links" />
</template>
