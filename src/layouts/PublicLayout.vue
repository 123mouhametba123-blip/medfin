<script setup>
import AppHeader from '../components/AppHeader.vue'
import BrandLogo from '../components/BrandLogo.vue'

const links = [
  { to: '/', label: 'Rechercher' },
  { to: '/pharmacies', label: 'Pharmacies' },
]
</script>

<template>
  <AppHeader :links="links" />
  <main><RouterView /></main>

  <footer class="footer">
    <div class="wrap footer-inner">
      <div>
        <BrandLogo />
        <p class="footer-note">
          MediProxi est un outil de recherche de disponibilité : ce n'est ni un service de diagnostic,
          ni de prescription.
        </p>
      </div>

      <nav class="footer-links" aria-label="Liens de pied de page">
        <RouterLink to="/">Rechercher</RouterLink>
        <RouterLink to="/pharmacies">Pharmacies</RouterLink>
        <RouterLink to="/inscription">Inscrire ma pharmacie</RouterLink>
      </nav>
    </div>
  </footer>
</template>
