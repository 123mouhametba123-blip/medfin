<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore } from '../../stores/search'
import SearchBar from '../../components/SearchBar.vue'
import StockCard from '../../components/StockCard.vue'

const search = useSearchStore()
const route = useRoute()

const suggestions = ['Doliprane', 'Paracétamol', 'Amoxicilline', 'Coartem']
const nearMeMessage = ref('')

function quickSearch(name) {
  search.q = name
  search.search()
}

// Demande la position du navigateur puis trie les résultats par distance
function searchNearMe() {
  nearMeMessage.value = ''

  if (!navigator.geolocation) {
    nearMeMessage.value = "La géolocalisation n'est pas disponible sur cet appareil."
    return
  }

  navigator.geolocation.getCurrentPosition(
    function (position) {
      search.latitude = position.coords.latitude
      search.longitude = position.coords.longitude
      search.search()
    },
    function () {
      nearMeMessage.value = "Impossible d'obtenir votre position. Vérifiez l'autorisation du navigateur."
    }
  )
}

// Permet d'arriver avec /?q=doliprane&city=Dakar (ex : depuis l'historique)
onMounted(() => {
    if (route.query.q) {
      search.q = route.query.q
      search.city = route.query.city || ''
      search.neighborhood = route.query.neighborhood || ''
      search.search()
    }
})
</script>

<template>
  <section class="hero">
    <div class="wrap hero-inner">
      <span class="eyebrow">
        <span class="eyebrow-dot"></span>
        Disponibilités déclarées par les pharmacies
      </span>

      <h1>Trouvez votre médicament <span class="hl">près de chez vous</span>, en quelques secondes.</h1>
      <p class="hero-text">
        Voyez quelles pharmacies déclarent l'avoir en stock, comparez les prix et appelez avant de vous déplacer.
      </p>

      <ul class="hero-badges">
        <li>
          <span class="hero-check" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="m5 13 4 4L19 7" />
            </svg>
          </span>
          Sans compte
        </li>
        <li>
          <span class="hero-check" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="m5 13 4 4L19 7" />
            </svg>
          </span>
          Prix et stocks comparés
        </li>
        <li>
          <span class="hero-check" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="m5 13 4 4L19 7" />
            </svg>
          </span>
          Pharmacies vérifiées
        </li>
      </ul>
    </div>
  </section>

  <div class="wrap -mt-12 relative">
    <SearchBar
      v-model:q="search.q"
      v-model:city="search.city"
      v-model:neighborhood="search.neighborhood"
      :loading="search.loading"
      @submit="search.search()"
    />

    <div class="chips">
      <button type="button" class="chip chip-accent" @click="searchNearMe">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        Près de moi
      </button>
      <label class="check">
        <input v-model="search.onDuty" type="checkbox" @change="search.search()" />
        De garde maintenant
      </label>
    </div>

    <p v-if="nearMeMessage" class="alert alert-warn">{{ nearMeMessage }}</p>

    <div class="chips">
      <span>Essayez :</span>
      <button v-for="name in suggestions" :key="name" type="button" class="chip" @click="quickSearch(name)">
        {{ name }}
      </button>
    </div>
  </div>

  <section class="wrap page">
    <p v-if="search.error" class="alert alert-error">{{ search.error }}</p>

    <p v-else-if="search.loading" class="muted">Recherche en cours…</p>

    <template v-else-if="search.searched">
      <p v-if="search.results.length === 0" class="empty">
        Aucune pharmacie ne déclare ce médicament en stock pour le moment. Essayez un autre nom ou une autre ville.
      </p>

      <template v-else>
        <p class="eyebrow eyebrow-dark">Résultats</p>
        <h2 class="section-title">{{ search.results.length }} pharmacie(s), du prix le plus bas au plus haut</h2>
        <p class="alert alert-info">
          Ces disponibilités sont déclarées par les pharmacies et peuvent changer à tout moment. Appelez la pharmacie pour confirmer avant de vous déplacer.
        </p>
        <div class="stack">
          <StockCard v-for="stock in search.results" :key="stock.id" :stock="stock" />
        </div>
      </template>
    </template>

    <template v-else>
      <p class="eyebrow eyebrow-dark">Simple et rapide</p>
      <h2 class="section-title">Comment ça marche</h2>
      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <h3>Recherchez</h3>
          <p class="muted">Tapez le nom du médicament et votre ville. Aucun compte n'est nécessaire.</p>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <h3>Comparez</h3>
          <p class="muted">Consultez les pharmacies qui l'ont en stock, avec le prix et la date de mise à jour.</p>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <h3>Appelez</h3>
          <p class="muted">Un appel pour confirmer, puis vous vous déplacez une seule fois.</p>
        </div>
      </div>

      <div class="cta">
        <div>
          <h2>Vous êtes pharmacien ?</h2>
          <p>Rendez vos médicaments visibles et recevez plus de patients.</p>
        </div>
        <RouterLink to="/inscription" class="btn btn-light">Inscrire ma pharmacie</RouterLink>
      </div>
    </template>
  </section>
</template>
