<script setup>
import { ref, onMounted } from 'vue'
import { getReports, resolveReport } from '../../api/admin'
import { getErrorMessage } from '../../composables/useApiError'

const reports = ref([])
const status = ref('ouvert') // ouvert | traité | '' (tous)
const error = ref('')

async function load() {
  error.value = ''
  try {
    const response = await getReports(status.value)
    reports.value = response.data.data
  } catch (e) {
    error.value = getErrorMessage(e)
  }
}

onMounted(load)

async function resolve(report) {
  await resolveReport(report.id)
  await load()
}

function dateLabel(value) {
  return new Date(value).toLocaleString('fr-FR')
}
</script>

<template>
  <h1>Signalements</h1>

  <div class="tabs">
    <label><input v-model="status" type="radio" value="ouvert" @change="load" /> Ouverts</label>
    <label><input v-model="status" type="radio" value="traité" @change="load" /> Traités</label>
    <label><input v-model="status" type="radio" value="" @change="load" /> Tous</label>
  </div>

  <p v-if="error" class="alert alert-error">{{ error }}</p>
  <p v-if="reports.length === 0" class="empty">Aucun signalement dans cette liste.</p>

  <div v-else class="table-wrap">
    <table class="data-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Médicament</th>
          <th>Pharmacie</th>
          <th>Raison</th>
          <th>Auteur</th>
          <th>Statut</th>
          <th><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="report in reports" :key="report.id">
          <td>{{ dateLabel(report.created_at) }}</td>
          <td>{{ report.stock ? report.stock.medicine : '—' }}</td>
          <td>{{ report.stock ? report.stock.pharmacy : '—' }}</td>
          <td>{{ report.reason }}</td>
          <td>{{ report.user ? report.user : 'Visiteur' }}</td>
          <td>
            <span class="badge" :class="report.status === 'ouvert' ? 'badge-low' : 'badge-ok'">
              {{ report.status }}
            </span>
          </td>
          <td class="actions">
            <button v-if="report.status === 'ouvert'" class="btn btn-primary" @click="resolve(report)">
              Marquer traité
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
