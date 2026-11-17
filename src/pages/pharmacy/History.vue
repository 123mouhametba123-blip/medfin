<script setup>
import { ref, onMounted } from 'vue'
import { getStockHistory } from '../../api/pharmacy'
import { getErrorMessage } from '../../composables/useApiError'
import { formatPrice } from '../../composables/useFormat'

const histories = ref([])
const error = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await getStockHistory()
    histories.value = response.data.data
  } catch (e) {
    error.value = getErrorMessage(e)
  } finally {
    loading.value = false
  }
})

// Affiche "—" quand il n'y avait pas d'ancienne valeur (ajout)
function oldValue(value, isPrice) {
  if (value === null || value === undefined) return '—'
  if (isPrice) return formatPrice(value)
  return value
}

function dateLabel(value) {
  return new Date(value).toLocaleString('fr-FR')
}
</script>

<template>
  <h1>Historique du stock</h1>

  <p v-if="error" class="alert alert-error">{{ error }}</p>
  <p v-if="loading" class="muted">Chargement…</p>

  <p v-else-if="histories.length === 0" class="empty">
    Aucun mouvement de stock pour le moment. Vos ajouts, modifications et suppressions apparaîtront ici.
  </p>

  <div v-else class="table-wrap">
    <table class="data-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Médicament</th>
          <th>Quantité</th>
          <th>Prix</th>
          <th>Auteur</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in histories" :key="item.id">
          <td>{{ dateLabel(item.created_at) }}</td>
          <td>{{ item.medicine_name }}</td>
          <td>
            {{ oldValue(item.old_quantity) }}
            → {{ item.new_quantity === null ? 'supprimé' : item.new_quantity }}
          </td>
          <td>
            {{ oldValue(item.old_price, true) }}
            → {{ item.new_price === null ? '—' : formatPrice(item.new_price) }}
          </td>
          <td>{{ item.user }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
