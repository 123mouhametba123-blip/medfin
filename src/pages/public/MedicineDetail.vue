<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getMedicine, getMedicineAvailability } from '../../api/public'
import { getErrorMessage } from '../../composables/useApiError'
import StockCard from '../../components/StockCard.vue'

const route = useRoute()
const medicine = ref(null)
const stocks = ref([])
const error = ref('')

onMounted(async () => {
  try {
    const [medicineResponse, availabilityResponse] = await Promise.all([
      getMedicine(route.params.id),
      getMedicineAvailability(route.params.id),
    ])
    medicine.value = medicineResponse.data.data
    stocks.value = availabilityResponse.data.data
  } catch (e) {
    error.value = getErrorMessage(e)
  }
})
</script>

<template>
  <section class="wrap page">
    <RouterLink to="/" class="back-link">← Retour à la recherche</RouterLink>

    <p v-if="error" class="alert alert-error">{{ error }}</p>

    <template v-else-if="medicine">
      <div class="detail-head">
        <span class="detail-mark" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.5 20.5 3.5 13.5a4.95 4.95 0 0 1 7-7l7 7a4.95 4.95 0 0 1-7 7Z" />
            <path d="m8.5 8.5 7 7" />
          </svg>
        </span>

        <div>
          <div class="tag-badges">
            <span v-if="medicine.requires_prescription" class="badge badge-warn">Ordonnance obligatoire</span>
            <span v-if="medicine.form" class="badge badge-soft">{{ medicine.form }}</span>
            <span v-if="medicine.dosage" class="badge badge-soft">{{ medicine.dosage }}</span>
          </div>

          <h1>{{ medicine.name }}</h1>

          <p v-if="medicine.generic_name" class="muted">Nom générique (DCI) : {{ medicine.generic_name }}</p>
          <p v-if="medicine.description">{{ medicine.description }}</p>
        </div>
      </div>

      <h2 class="section-title">{{ stocks.length }} pharmacie(s) qui déclarent ce médicament en stock</h2>

      <p v-if="stocks.length === 0" class="empty">
        Aucune pharmacie validée ne déclare ce médicament en stock pour le moment.
      </p>

      <template v-else>
        <p class="alert alert-info">
          Ces disponibilités sont déclaratives. Appelez la pharmacie pour confirmer avant de vous déplacer.
        </p>
        <div class="stack">
          <StockCard v-for="stock in stocks" :key="stock.id" :stock="stock" />
        </div>
      </template>
    </template>
  </section>
</template>
