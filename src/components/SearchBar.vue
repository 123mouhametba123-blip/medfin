<script setup>
// Formulaire de recherche : médicament + ville + quartier
defineProps({
  q: String,
  city: String,
  neighborhood: String,
  loading: Boolean,
})
const emit = defineEmits(['update:q', 'update:city', 'update:neighborhood', 'submit'])
</script>

<template>
  <form class="searchbar" @submit.prevent="emit('submit')">
    <label class="field">
      <span>Médicament</span>
      <input
        :value="q"
        type="search"
        placeholder="Ex : Doliprane, paracétamol…"
        @input="emit('update:q', $event.target.value)"
      />
    </label>
    <label class="field">
      <span>Ville</span>
      <input
        :value="city"
        type="text"
        placeholder="Ex : Dakar"
        @input="emit('update:city', $event.target.value)"
      />
    </label>
    <label class="field">
      <span>Quartier</span>
      <input
        :value="neighborhood"
        type="text"
        placeholder="Ex : Plateau"
        @input="emit('update:neighborhood', $event.target.value)"
      />
    </label>
    <button class="btn btn-primary" type="submit" :disabled="loading">
      {{ loading ? 'Recherche…' : 'Trouver en pharmacie' }}
    </button>
  </form>
</template>
