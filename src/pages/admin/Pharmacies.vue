<script setup>
import { ref, onMounted } from 'vue'
import { getAdminPharmacies, approvePharmacy, suspendPharmacy } from '../../api/admin'
import { getErrorMessage } from '../../composables/useApiError'

const pharmacies = ref([])
const status = ref('pending') // pending | approved | '' (toutes)
const error = ref('')

async function load() {
  try {
    const response = await getAdminPharmacies(status.value)
    pharmacies.value = response.data.data
  } catch (e) {
    error.value = getErrorMessage(e)
  }
}

onMounted(load)

async function approve(p) {
  await approvePharmacy(p.id)
  await load()
}

async function suspend(p) {
  if (!confirm('Suspendre ' + p.name + ' ? Elle disparaîtra de la recherche.')) return
  await suspendPharmacy(p.id)
  await load()
}
</script>

<template>
  <h1>Pharmacies</h1>

  <div class="tabs">
    <label><input v-model="status" type="radio" value="pending" @change="load" /> À valider</label>
    <label><input v-model="status" type="radio" value="approved" @change="load" /> Validées</label>
    <label><input v-model="status" type="radio" value="" @change="load" /> Toutes</label>
  </div>

  <p v-if="error" class="alert alert-error">{{ error }}</p>
  <p v-if="pharmacies.length === 0" class="empty">Aucune pharmacie dans cette liste.</p>

  <div v-else class="table-wrap">
    <table class="data-table">
      <thead>
        <tr>
          <th>Pharmacie</th>
          <th>Ville</th>
          <th>Gérant</th>
          <th>Statut</th>
          <th><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in pharmacies" :key="p.id">
          <td>
            {{ p.name }}
            <div class="muted">{{ p.address }}</div>
          </td>
          <td>{{ p.city }}</td>
          <td>
            {{ p.owner ? p.owner.name : '' }}
            <div class="muted">{{ p.owner ? p.owner.email : '' }}</div>
          </td>
          <td>
            <span class="badge" :class="p.is_approved ? 'badge-ok' : 'badge-low'">
              {{ p.is_approved ? 'Validée' : 'En attente' }}
            </span>
          </td>
          <td class="actions">
            <button v-if="!p.is_approved" class="btn btn-primary" @click="approve(p)">Valider</button>
            <button v-else class="btn btn-danger" @click="suspend(p)">Suspendre</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
