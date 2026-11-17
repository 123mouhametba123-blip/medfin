<script setup>
import { ref, onMounted } from 'vue'
import { getDashboard } from '../../api/admin'

const stats = ref(null)

onMounted(async () => {
  const response = await getDashboard()
  stats.value = response.data
})
</script>

<template>
  <h1>Tableau de bord</h1>

  <p v-if="stats === null" class="muted">Chargement…</p>

  <div v-else class="cards">
    <div class="card stat">
      <strong>{{ stats.pharmacies_pending }}</strong>
      <span>pharmacie(s) à valider</span>
      <RouterLink v-if="stats.pharmacies_pending > 0" to="/admin/pharmacies">Voir les demandes</RouterLink>
    </div>
    <div class="card stat">
      <strong>{{ stats.pharmacies_approved }}</strong>
      <span>pharmacie(s) validée(s)</span>
    </div>
    <div class="card stat">
      <strong>{{ stats.patients }}</strong>
      <span>patient(s) inscrit(s)</span>
    </div>
    <div class="card stat">
      <strong>{{ stats.medicines }}</strong>
      <span>médicament(s) au catalogue</span>
    </div>
    <div class="card stat">
      <strong>{{ stats.stock_lines }}</strong>
      <span>ligne(s) de stock</span>
    </div>
    <div class="card stat">
      <strong>{{ stats.reports_open }}</strong>
      <span>signalement(s) à traiter</span>
      <RouterLink v-if="stats.reports_open > 0" to="/admin/signalements">Voir les signalements</RouterLink>
    </div>
  </div>
</template>
