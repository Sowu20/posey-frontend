<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container">

      <div class="text-center mb-5">
        <img src="/img/default-avatar.png" class="rounded-circle mb-3 border" width="100" height="100" />
        <h4 class="fw-bold mb-0">{{ user.prenom }} {{ user.nom }}</h4>
        <p class="text-muted">{{ user.email }}</p>
      </div>

      <!-- Menu -->
      <div class="d-flex justify-content-center gap-3 mb-4 flex-wrap">
        <button class="btn" :class="currentView === 'stats' ? 'btn-primary' : 'btn-outline-primary'" @click="currentView = 'stats'">Vue d’ensemble</button>
        <button class="btn" :class="currentView === 'recues' ? 'btn-primary' : 'btn-outline-primary'" @click="currentView = 'recues'">Prestations reçues</button>
        <button class="btn" :class="currentView === 'refusees' ? 'btn-primary' : 'btn-outline-primary'" @click="currentView = 'refusees'">Prestations refusées</button>
        <button class="btn" :class="currentView === 'commandes' ? 'btn-primary' : 'btn-outline-primary'" @click="currentView = 'commandes'">Commandes</button>
        <button class="btn" :class="currentView === 'prestations' ? 'btn-primary' : 'btn-outline-primary'" @click="currentView = 'prestations'">Prestations Disponibles</button>
        <button class="btn" :class="currentView === 'services' ? 'btn-primary' : 'btn-outline-primary'" @click="currentView = 'services'">Services</button>
      </div>

      <!-- Affichage dynamique -->
      <PrestataireStats v-if="currentView === 'stats'" />
      <PrestationsRecues v-if="currentView === 'recues'" />
      <PrestationsRefusees v-if="currentView === 'refusees'" />
      <OrderListCommande v-if="currentView === 'commandes'" />
      <OrderPrestationDisponible v-if="currentView === 'prestations'" />
      <ServicesProvider v-if="currentView === 'services'" />

    </div>
  </div>
</template>

<script>
  import PrestataireStats from '../composants/PrestataireStats.vue'
  import PrestationsRecues from '../composants/PrestationsRecues.vue'
  import PrestationsRefusees from '../composants/PrestationsRefusees.vue'
  import OrderListCommande from '../composants/OrderListCommande.vue'
  import OrderPrestationDisponible from '../composants/OrderPrestationDisponible.vue'
  import ServicesProvider from '../composants/ServicesProvider.vue'

  export default {
    name: 'DashboardProviderTemplate',
    components: {
      PrestataireStats,
      PrestationsRecues,
      PrestationsRefusees,
      OrderListCommande,
      OrderPrestationDisponible,
      ServicesProvider
    },
    setup() {
      const formatImage = (imagePath) => {
        if (!imagePath) return '/img/default-avatar.png'
        if (imagePath.startsWith('http')) return imagePath
        return `http://127.0.0.1:8000${imagePath}`
      }

      return { formatImage }
    },
    data() {
      return {
        currentView: 'stats',
        user: JSON.parse(localStorage.getItem('auth_user_data')) || {},
      }
    },
  }
</script>
