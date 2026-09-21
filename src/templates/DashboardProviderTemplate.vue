<template>
  <dashboard-layout>
    <dashboard-sidebar
      subtitle="Espace Prestataire"
      :items="navItems"
      :active-view="currentView"
      @navigate="currentView = $event"
    />

    <div class="dashboard-main">
      <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h2 class="fw-bold mb-1">Tableau de bord</h2>
          <p class="posey-text-muted mb-0">Bienvenue {{ user.prenom }}, voici un aperçu de votre activité.</p>
        </div>
        <button class="posey-btn-primary" @click="currentView = 'services'">
          <i class="fas fa-plus me-2"></i>Ajouter un service
        </button>
      </div>

      <PrestataireStats v-if="currentView === 'stats'" />
      <PrestationsRecues v-if="currentView === 'recues'" />
      <PrestationsRefusees v-if="currentView === 'refusees'" />
      <OrderListCommande v-if="currentView === 'commandes'" />
      <OrderPrestationDisponible v-if="currentView === 'prestations'" />
      <ServicesProvider v-if="currentView === 'services'" />
    </div>
  </dashboard-layout>
</template>

<script>
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardSidebar from '@/components/DashboardSidebar.vue'
import PrestataireStats from '@/components/PrestataireStats.vue'
import PrestationsRecues from '@/components/PrestationsRecues.vue'
import PrestationsRefusees from '@/components/PrestationsRefusees.vue'
import OrderListCommande from '@/components/OrderListCommande.vue'
import OrderPrestationDisponible from '@/components/OrderPrestationDisponible.vue'
import ServicesProvider from '@/components/ServicesProvider.vue'

export default {
  name: 'DashboardProviderTemplate',
  components: {
    DashboardLayout,
    DashboardSidebar,
    PrestataireStats,
    PrestationsRecues,
    PrestationsRefusees,
    OrderListCommande,
    OrderPrestationDisponible,
    ServicesProvider,
  },
  data() {
    return {
      currentView: 'stats',
      user: JSON.parse(localStorage.getItem('auth_user_data')) || {},
      navItems: [
        { id: 'stats', label: 'Tableau de bord', icon: 'fas fa-th-large' },
        { id: 'services', label: 'Mes services', icon: 'fas fa-briefcase' },
        { id: 'recues', label: 'Demandes', icon: 'fas fa-inbox' },
        { id: 'commandes', label: 'Commandes', icon: 'fas fa-shopping-bag' },
        { id: 'prestations', label: 'Prestations disponibles', icon: 'fas fa-list' },
        { id: 'refusees', label: 'Refusées', icon: 'fas fa-times-circle' },
      ],
    }
  },
}
</script>
