<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getProfile, updateProfile } from '../../api/pharmacy'
import { getErrorMessage } from '../../composables/useApiError'

const pharmacy = ref(null)
const form = reactive({
  name: '', address: '', neighborhood: '', city: '', phone: '',
  latitude: '', longitude: '',
})
const message = ref('')
const error = ref('')

onMounted(async () => {
  try {
    const response = await getProfile()
    pharmacy.value = response.data.data
    form.name = pharmacy.value.name
    form.address = pharmacy.value.address
    form.neighborhood = pharmacy.value.neighborhood || ''
    form.city = pharmacy.value.city
    form.phone = pharmacy.value.phone || ''
    form.latitude = pharmacy.value.latitude !== null ? pharmacy.value.latitude : ''
    form.longitude = pharmacy.value.longitude !== null ? pharmacy.value.longitude : ''
  } catch (e) {
    error.value = getErrorMessage(e)
  }
})

async function save() {
  message.value = ''
  error.value = ''
  try {
    const response = await updateProfile(form)
    pharmacy.value = response.data.data
    message.value = 'Informations enregistrées.'
  } catch (e) {
    error.value = getErrorMessage(e)
  }
}
</script>

<template>
  <h1>Ma pharmacie</h1>

  <p v-if="error" class="alert alert-error">{{ error }}</p>

  <template v-if="pharmacy">
    <p v-if="pharmacy.is_approved" class="alert alert-ok">
      Pharmacie validée : vos médicaments sont visibles dans la recherche.
    </p>
    <p v-else class="alert alert-warn">
      En attente de validation par un administrateur. Vous pourrez ajouter votre stock dès qu'elle sera validée.
    </p>

    <form class="form card" @submit.prevent="save">
      <p v-if="message" class="alert alert-ok">{{ message }}</p>

      <label class="field">
        <span>Nom</span>
        <input v-model="form.name" type="text" required />
      </label>
      <label class="field">
        <span>Adresse</span>
        <input v-model="form.address" type="text" required />
      </label>
      <label class="field">
        <span>Quartier</span>
        <input v-model="form.neighborhood" type="text" placeholder="Ex : Plateau" />
      </label>
      <label class="field">
        <span>Ville</span>
        <input v-model="form.city" type="text" required />
      </label>
      <label class="field">
        <span>Téléphone</span>
        <input v-model="form.phone" type="tel" placeholder="Ex : 77 123 45 67" />
      </label>

      <p class="muted">
        Coordonnées GPS (facultatif) : elles servent au tri « Près de moi » et au lien d'itinéraire.
      </p>
      <label class="field">
        <span>Latitude</span>
        <input v-model="form.latitude" type="number" step="any" placeholder="Ex : 14.6928" />
      </label>
      <label class="field">
        <span>Longitude</span>
        <input v-model="form.longitude" type="number" step="any" placeholder="Ex : -17.4467" />
      </label>

      <button class="btn btn-primary" type="submit">Enregistrer les informations</button>
    </form>
  </template>
</template>
