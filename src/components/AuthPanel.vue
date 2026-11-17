<script setup>
import BrandLogo from './BrandLogo.vue'
</script>

<template>
  <div class="auth-side">
    <BrandLogo light />

    <div class="auth-side-body">
      <h2>Trouvez votre médicament plus facilement, près de chez vous.</h2>
      <p>Moins de déplacements inutiles, plus de temps pour vous soigner.</p>

      <ul>
        <li>
          <span class="check-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="m5 13 4 4L19 7" />
            </svg>
          </span>
          Recherche gratuite, sans compte
        </li>
        <li>
          <span class="check-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="m5 13 4 4L19 7" />
            </svg>
          </span>
          Prix et disponibilités déclarés par les pharmacies
        </li>
        <li>
          <span class="check-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="m5 13 4 4L19 7" />
            </svg>
          </span>
          Pharmacies vérifiées par l'équipe MediProxi
        </li>
      </ul>
    </div>

    <p class="auth-trust">Un outil simple, pensé pour le Sénégal.</p>
  </div>
</template>
