<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPharmacy } from '../../api/public'
import { getErrorMessage } from '../../composables/useApiError'
import { formatPrice, stockLabel, stockLevel } from '../../composables/useFormat'

const route = useRoute()
const pharmacy = ref(null)
const error = ref('')

// Lien d'itinéraire si la pharmacie a des coordonnées GPS
const mapUrl = computed(function () {
  if (!pharmacy.value) return null
  if (pharmacy.value.latitude === null || pharmacy.value.longitude === null) return null

  return 'https://www.google.com/maps/dir/?api=1&destination=' + pharmacy.value.latitude + ',' + pharmacy.value.longitude
})

onMounted(async () => {
  try {
    const response = await getPharmacy(route.params.id)
    pharmacy.value = response.data.data
  } catch (e) {
    error.value = getErrorMessage(e)
  }
})
</script>

<template>
  <section class="wrap page">
    <RouterLink to="/pharmacies" class="back-link">← Toutes les pharmacies</RouterLink>

    <p v-if="error" class="alert alert-error">{{ error }}</p>

    <template v-else-if="pharmacy">
      <div class="detail-head">
        <span class="detail-mark" aria-hidden="true">{{ pharmacy.name.charAt(0) }}</span>

        <div>
          <div class="tag-badges">
            <span v-if="pharmacy.is_on_duty" class="badge badge-ok">De garde maintenant</span>
            <span v-if="pharmacy.neighborhood" class="badge badge-soft">{{ pharmacy.neighborhood }}</span>
          </div>

          <h1>{{ pharmacy.name }}</h1>
          <p class="muted">{{ pharmacy.address }}, {{ pharmacy.city }}</p>

          <div class="tag-actions mt-3">
            <a v-if="pharmacy.phone" class="btn btn-primary btn-sm" :href="'tel:' + pharmacy.phone">Appeler</a>
            <a
              v-if="pharmacy.whatsapp"
              class="btn btn-ghost btn-sm"
              :href="'https://wa.me/' + pharmacy.whatsapp + '?text=' + encodeURIComponent('Bonjour, avez-vous des médicaments en stock ?')"
              target="_blank"
              rel="noopener"
            >
              WhatsApp
            </a>
            <a v-if="mapUrl" class="btn btn-ghost btn-sm" :href="mapUrl" target="_blank" rel="noopener">
              Itinéraire
            </a>
          </div>
        </div>
      </div>

      <h2 class="section-title">Stock déclaré</h2>
      <p class="alert alert-info">
        Les quantités sont déclarées par la pharmacie et peuvent changer. Appelez avant de vous déplacer.
      </p>

      <p v-if="pharmacy.stocks.length === 0" class="empty">Cette pharmacie n'a déclaré aucun stock.</p>

      <div v-else class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Médicament</th>
              <th>Disponibilité</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stock in pharmacy.stocks" :key="stock.id">
              <td>
                <RouterLink :to="'/medicaments/' + stock.medicine.id">{{ stock.medicine.name }}</RouterLink>
              </td>
              <td>
                <span class="badge" :class="'badge-' + stockLevel(stock.quantity)">
                  {{ stockLabel(stock.quantity) }}
                </span>
              </td>
              <td>{{ formatPrice(stock.price) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </section>
</template>
