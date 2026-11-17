<script setup>
import { ref, onMounted } from 'vue'
import { getPharmacies } from '../../api/public'

const pharmacies = ref([])
const city = ref('')
const neighborhood = ref('')
const loading = ref(false)

async function load() {
  loading.value = true
  try {
    const response = await getPharmacies({ city: city.value, neighborhood: neighborhood.value })
    pharmacies.value = response.data.data
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="wrap page">
    <div class="page-head">
      <div>
        <p class="eyebrow eyebrow-dark">Annuaire</p>
        <h1>Pharmacies partenaires</h1>
        <p class="muted">Filtrez par ville ou par quartier pour trouver la pharmacie la plus proche.</p>
      </div>
    </div>

    <form class="card filter-bar" @submit.prevent="load">
      <label class="field">
        <span>Ville</span>
        <input v-model="city" type="text" placeholder="Ex : Thiès" />
      </label>
      <label class="field">
        <span>Quartier</span>
        <input v-model="neighborhood" type="text" placeholder="Ex : Plateau" />
      </label>
      <button class="btn btn-primary" type="submit">Filtrer</button>
    </form>

    <p v-if="loading" class="muted">Chargement…</p>
    <p v-else-if="pharmacies.length === 0" class="empty">Aucune pharmacie trouvée pour cette ville.</p>

    <div class="cards">
      <article v-for="p in pharmacies" :key="p.id" class="card pharmacy-card">
        <div class="card-head">
          <span class="pharmacy-mark" aria-hidden="true">{{ p.name.charAt(0) }}</span>
          <div>
            <h3>
              <RouterLink :to="'/pharmacies/' + p.id">{{ p.name }}</RouterLink>
            </h3>
            <p class="muted">{{ p.city }}<span v-if="p.neighborhood"> · {{ p.neighborhood }}</span></p>
          </div>
        </div>

        <p class="pharmacy-address">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {{ p.address }}
        </p>

        <p v-if="p.is_on_duty"><span class="badge badge-ok">De garde</span></p>

        <div class="card-foot">
          <a v-if="p.phone" class="btn btn-ghost btn-sm" :href="'tel:' + p.phone">Appeler</a>
          <RouterLink class="btn btn-primary btn-sm" :to="'/pharmacies/' + p.id">Voir la fiche</RouterLink>
        </div>
      </article>
    </div>
  </section>
</template>
