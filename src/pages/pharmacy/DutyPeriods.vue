<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getDutyPeriods, addDutyPeriod, deleteDutyPeriod } from '../../api/pharmacy'
import { getErrorMessage } from '../../composables/useApiError'

const periods = ref([])
const error = ref('')
const message = ref('')

const form = reactive({ starts_at: '', ends_at: '' })

async function load() {
  try {
    const response = await getDutyPeriods()
    periods.value = response.data.data
  } catch (e) {
    error.value = getErrorMessage(e)
  }
}

onMounted(load)

async function add() {
  error.value = ''
  message.value = ''
  try {
    await addDutyPeriod(form)
    message.value = 'Période de garde ajoutée.'
    form.starts_at = ''
    form.ends_at = ''
    await load()
  } catch (e) {
    error.value = getErrorMessage(e)
  }
}

async function remove(periode) {
  if (!confirm('Supprimer cette période de garde ?')) return
  error.value = ''
  try {
    await deleteDutyPeriod(periode.id)
    await load()
  } catch (e) {
    error.value = getErrorMessage(e)
  }
}

function dateLabel(value) {
  return new Date(value).toLocaleString('fr-FR')
}
</script>

<template>
  <h1>Pharmacies de garde</h1>

  <p class="alert alert-info">
    Déclarez vos périodes de garde : votre pharmacie apparaîtra avec un badge « De garde »
    et pourra être filtrée dans la recherche pendant ces horaires.
  </p>

  <p v-if="error" class="alert alert-error">{{ error }}</p>
  <p v-if="message" class="alert alert-ok">{{ message }}</p>

  <form class="card form" @submit.prevent="add">
    <h2>Ajouter une période</h2>

    <label class="field">
      <span>Début</span>
      <input v-model="form.starts_at" type="datetime-local" required />
    </label>
    <label class="field">
      <span>Fin</span>
      <input v-model="form.ends_at" type="datetime-local" required />
    </label>

    <button class="btn btn-primary" type="submit">Ajouter la garde</button>
  </form>

  <p v-if="periods.length === 0" class="empty">Aucune période de garde déclarée.</p>

  <div v-else class="table-wrap">
    <table class="data-table">
      <thead>
        <tr>
          <th>Début</th>
          <th>Fin</th>
          <th><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="periode in periods" :key="periode.id">
          <td>{{ dateLabel(periode.starts_at) }}</td>
          <td>{{ dateLabel(periode.ends_at) }}</td>
          <td class="actions">
            <button class="btn btn-danger" @click="remove(periode)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
