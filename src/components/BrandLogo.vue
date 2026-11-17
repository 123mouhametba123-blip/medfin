<script setup>
defineProps({ light: Boolean })
</script>

<template>
  <RouterLink to="/" class="brand" :class="{ 'brand-light': light }">
    <span class="brand-mark" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
      </svg>
    </span>
    MediProxi
  </RouterLink>
</template>
