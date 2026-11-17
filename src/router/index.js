import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import PublicLayout from '../layouts/PublicLayout.vue'
import PatientLayout from '../layouts/PatientLayout.vue'
import PharmacyLayout from '../layouts/PharmacyLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: () => import('../pages/public/Home.vue') },
      { path: 'pharmacies', name: 'pharmacies', component: () => import('../pages/public/PharmacyList.vue') },
      { path: 'pharmacies/:id', name: 'pharmacy-detail', component: () => import('../pages/public/PharmacyDetail.vue') },
      { path: 'medicaments/:id', name: 'medicine-detail', component: () => import('../pages/public/MedicineDetail.vue') },
      { path: 'connexion', name: 'login', component: () => import('../pages/public/Login.vue'), meta: { guest: true } },
      { path: 'inscription', name: 'register', component: () => import('../pages/public/Register.vue'), meta: { guest: true } },
    ],
  },
  {
    path: '/patient',
    component: PatientLayout,
    meta: { role: 'patient' },
    children: [{ path: '', name: 'patient-home', component: () => import('../pages/patient/Dashboard.vue') }],
  },
  {
    path: '/pharmacie',
    component: PharmacyLayout,
    meta: { role: 'pharmacy' },
    children: [
      { path: '', name: 'pharmacy-home', component: () => import('../pages/pharmacy/Dashboard.vue') },
      { path: 'stock', name: 'pharmacy-stock', component: () => import('../pages/pharmacy/Stocks.vue') },
      { path: 'historique', name: 'pharmacy-history', component: () => import('../pages/pharmacy/History.vue') },
      { path: 'gardes', name: 'pharmacy-duty', component: () => import('../pages/pharmacy/DutyPeriods.vue') },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { role: 'admin' },
    children: [
      { path: '', name: 'admin-home', component: () => import('../pages/admin/Dashboard.vue') },
      { path: 'pharmacies', name: 'admin-pharmacies', component: () => import('../pages/admin/Pharmacies.vue') },
      { path: 'medicaments', name: 'admin-medicines', component: () => import('../pages/admin/Medicines.vue') },
      { path: 'signalements', name: 'admin-reports', component: () => import('../pages/admin/Reports.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Garde de navigation : protège chaque espace selon le rôle
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Après un rafraîchissement, on a le token mais pas encore l'utilisateur
  if (auth.token && auth.user === null) {
    await auth.fetchMe()
  }

  // Espace réservé à un rôle (ex : /admin)
  const roleRequis = to.matched.map((r) => r.meta.role).find((r) => r !== undefined)

  if (roleRequis) {
    if (!auth.isLoggedIn) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (auth.role !== roleRequis) {
      return auth.homePath // mauvais rôle : retour vers son propre espace
    }
  }

  // Pages invité (connexion / inscription) inutiles si on est déjà connecté
  if (to.meta.guest && auth.isLoggedIn) {
    return auth.homePath
  }

  return true
})

export default router
