<script setup>
import DashboardShell from './DashboardShell.vue'

const links = [{ to: '/patient', label: 'Mon espace', icon: 'user' }]
</script>

<template>
  <DashboardShell space="Espace patient" :links="links" />
</template>
