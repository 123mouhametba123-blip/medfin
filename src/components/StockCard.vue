<script setup>
import { computed, ref } from 'vue'
import { formatPrice, formatDistance, stockLabel, stockLevel, timeAgo, isOld } from '../composables/useFormat'
import { createReport } from '../api/public'
import { getErrorMessage } from '../composables/useApiError'

// Une ligne de résultat : médicament, pharmacie, prix, disponibilité déclarée
const props = defineProps({
  stock: { type: Object, required: true },
})

// Message pré-rempli du bouton WhatsApp
const whatsappText = computed(function () {
  return encodeURIComponent('Bonjour, avez-vous ' + props.stock.medicine.name + ' en stock ?')
})

// Lien Google Maps si la pharmacie a des coordonnées
const itineraryUrl = computed(function () {
  const pharmacy = props.stock.pharmacy

  if (pharmacy.latitude === null || pharmacy.longitude === null) {
    return null
  }

  return 'https://www.google.com/maps/dir/?api=1&destination=' + pharmacy.latitude + ',' + pharmacy.longitude
})

const showReport = ref(false)
const reason = ref('')
const reportMessage = ref('')
const reportError = ref('')

async function sendReport() {
  reportError.value = ''
  reportMessage.value = ''

  try {
    await createReport({ stock_id: props.stock.id, reason: reason.value })
    reportMessage.value = 'Merci, votre signalement a bien été transmis.'
    reason.value = ''
    showReport.value = false
  } catch (e) {
    reportError.value = getErrorMessage(e)
  }
}
</script>

<template>
  <article class="tag" :class="'tag-' + stockLevel(stock.quantity)">
    <div class="tag-icon" aria-hidden="true">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.5 20.5 3.5 13.5a4.95 4.95 0 0 1 7-7l7 7a4.95 4.95 0 0 1-7 7Z" />
        <path d="m8.5 8.5 7 7" />
      </svg>
    </div>

    <div class="tag-body">
      <div class="tag-head">
        <h3 class="tag-title">
          <RouterLink :to="'/medicaments/' + stock.medicine.id">{{ stock.medicine.name }}</RouterLink>
        </h3>
        <div class="tag-badges">
          <span v-if="stock.pharmacy.is_on_duty" class="badge badge-ok">De garde</span>
          <span v-if="stock.medicine.requires_prescription" class="badge badge-warn">Ordonnance</span>
          <span v-if="stock.distance !== null && stock.distance !== undefined" class="badge badge-soft">
            {{ formatDistance(stock.distance) }}
          </span>
        </div>
      </div>

      <p class="tag-pharmacy">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <RouterLink :to="'/pharmacies/' + stock.pharmacy.id">{{ stock.pharmacy.name }}</RouterLink>
      </p>

      <p class="tag-address">
        {{ stock.pharmacy.address }}<span v-if="stock.pharmacy.neighborhood">, {{ stock.pharmacy.neighborhood }}</span>, {{ stock.pharmacy.city }}
      </p>

      <p v-if="stock.medicine.generic_name || stock.medicine.dosage || stock.medicine.form" class="tag-details">
        <span v-if="stock.medicine.generic_name">{{ stock.medicine.generic_name }}</span>
        <span v-if="stock.medicine.dosage"> · {{ stock.medicine.dosage }}</span>
        <span v-if="stock.medicine.form"> · {{ stock.medicine.form }}</span>
      </p>

      <p class="tag-meta">
        Déclaré
        <span :class="{ 'tag-meta-old': isOld(stock.updated_at) }">{{ timeAgo(stock.updated_at) }}</span>
        <span v-if="isOld(stock.updated_at)">— information ancienne, appelez avant de vous déplacer</span>
      </p>
    </div>

    <div class="tag-side">
      <div class="tag-price">
        <strong>{{ formatPrice(stock.price) }}</strong>
        <span class="badge" :class="'badge-' + stockLevel(stock.quantity)">
          {{ stockLabel(stock.quantity) }}
        </span>
      </div>

      <div class="tag-actions">
        <a v-if="stock.pharmacy.phone" class="btn btn-primary btn-sm" :href="'tel:' + stock.pharmacy.phone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
          </svg>
          Appeler
        </a>
        <a
          v-if="stock.pharmacy.whatsapp"
          class="btn btn-ghost btn-sm"
          :href="'https://wa.me/' + stock.pharmacy.whatsapp + '?text=' + whatsappText"
          target="_blank"
          rel="noopener"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
          </svg>
          WhatsApp
        </a>
        <a v-if="itineraryUrl" class="btn btn-ghost btn-sm" :href="itineraryUrl" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 11 22 2l-9 19-2-8-8-2Z" />
          </svg>
          Itinéraire
        </a>
      </div>

      <p v-if="stock.pharmacy.phone" class="tag-phone">{{ stock.pharmacy.phone }}</p>
    </div>

    <div class="report-zone">
      <button v-if="!showReport" type="button" class="report-link" @click="showReport = true">
        Signaler une information fausse
      </button>

      <form v-else class="report-form" @submit.prevent="sendReport">
        <label class="field">
          <span>Pourquoi cette information est-elle fausse ?</span>
          <textarea v-model="reason" rows="2" maxlength="500" required placeholder="Ex : le prix n'est pas le bon, le stock est vide…"></textarea>
        </label>
        <div class="actions">
          <button class="btn btn-primary" type="submit">Envoyer le signalement</button>
          <button class="btn btn-ghost" type="button" @click="showReport = false">Annuler</button>
        </div>
      </form>

      <p v-if="reportError" class="alert alert-error">{{ reportError }}</p>
      <p v-if="reportMessage" class="alert alert-ok">{{ reportMessage }}</p>
    </div>
  </article>
</template>
