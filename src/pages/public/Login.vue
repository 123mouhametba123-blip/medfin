<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { getErrorMessage } from '../../composables/useApiError'
import AuthPanel from '../../components/AuthPanel.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    // Retour vers la page demandée, sinon vers son espace
    if (route.query.redirect) {
      router.push(route.query.redirect)
    } else {
      router.push(auth.homePath)
    }
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
          <p class="eyebrow eyebrow-dark">Bon retour</p>
          <h1>Se connecter</h1>
          <p class="muted">Retrouvez votre espace MediProxi.</p>
        </div>

        <form class="form" @submit.prevent="submit">
          <p v-if="error" class="alert alert-error">{{ error }}</p>

          <label class="field">
            <span>Email</span>
            <input v-model="email" type="email" required autocomplete="email" placeholder="vous@exemple.com" />
          </label>
          <label class="field">
            <span>Mot de passe</span>
            <input v-model="password" type="password" required autocomplete="current-password" placeholder="••••••••" />
          </label>

          <button class="btn btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Connexion…' : 'Se connecter' }}
          </button>
        </form>

        <p class="muted">
          Pas encore de compte ?
          <RouterLink to="/inscription">Créer un compte</RouterLink>
        </p>
      </div>
    </div>
  </section>
</template>
