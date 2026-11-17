<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { getErrorMessage } from '../../composables/useApiError'
import AuthPanel from '../../components/AuthPanel.vue'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({
  role: 'patient',
  name: '',
  email: '',
  phone: '',
  password: '',
  pharmacy_name: '',
  address: '',
  city: '',
})
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.register(form)
    router.push(auth.homePath)
  } catch (e) {
    error.value = getErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="wrap page">
    <div class="auth">
      <AuthPanel />

      <div class="auth-form">
        <div class="auth-form-head">
          <p class="eyebrow eyebrow-dark">Rejoignez MediProxi</p>
          <h1>Créer un compte</h1>
          <p class="muted">Gratuit, en moins d'une minute.</p>
        </div>

        <form class="form" @submit.prevent="submit">
          <p v-if="error" class="alert alert-error">{{ error }}</p>

          <fieldset class="choice">
            <legend>Je suis</legend>
            <label><input v-model="form.role" type="radio" value="patient" /> Un patient</label>
            <label><input v-model="form.role" type="radio" value="pharmacy" /> Une pharmacie</label>
          </fieldset>

          <label class="field">
            <span>Nom complet</span>
            <input v-model="form.name" type="text" required />
          </label>
          <label class="field">
            <span>Email</span>
            <input v-model="form.email" type="email" required autocomplete="email" placeholder="vous@exemple.com" />
          </label>
          <label class="field">
            <span>Téléphone (facultatif)</span>
            <input v-model="form.phone" type="tel" placeholder="77 000 00 00" />
          </label>
          <label class="field">
            <span>Mot de passe (8 caractères minimum)</span>
            <input v-model="form.password" type="password" required minlength="8" autocomplete="new-password" />
          </label>

          <template v-if="form.role === 'pharmacy'">
            <label class="field">
              <span>Nom de la pharmacie</span>
              <input v-model="form.pharmacy_name" type="text" required />
            </label>
            <label class="field">
              <span>Adresse</span>
              <input v-model="form.address" type="text" required />
            </label>
            <label class="field">
              <span>Ville</span>
              <input v-model="form.city" type="text" required />
            </label>
            <p class="note">
              Votre pharmacie apparaîtra dans la recherche après validation par un administrateur.
            </p>
          </template>

          <button class="btn btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Création…' : 'Créer mon compte' }}
          </button>
        </form>

        <p class="muted">
          Déjà inscrit ?
          <RouterLink to="/connexion">Se connecter</RouterLink>
        </p>
      </div>
    </div>
  </section>
</template>
