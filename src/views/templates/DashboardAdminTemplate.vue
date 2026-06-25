<template>
  <dashboard-layout>
    <dashboard-sidebar
      subtitle="Administration"
      :items="navItems"
      :active-view="String(activeTab)"
      @navigate="activeTab = Number($event)"
    />

    <div class="dashboard-main">
      <div class="mb-4">
        <h2 class="fw-bold mb-1">Tableau de bord administrateur</h2>
        <p class="posey-text-muted mb-0">Gérez les utilisateurs, catégories, validations et commandes.</p>
      </div>

      <component :is="tabs[activeTab].component" />
    </div>
  </dashboard-layout>
</template>

<script>
import DashboardLayout from '../pages/DashboardLayout.vue'
import DashboardSidebar from '../composants/DashboardSidebar.vue'
import GestionUtilisateur from '../composants/GestionUtilisateur.vue'
import GestionCategoriePrestation from '../composants/GestionCategoriePrestation.vue'
import ValidationPrestataire from '../composants/ValidationPrestataire.vue'
import ListeCommandes from '../composants/ListeCommandes.vue'

export default {
  name: 'DashboardAdminTemplate',
  components: {
    DashboardLayout,
    DashboardSidebar,
    GestionUtilisateur,
    GestionCategoriePrestation,
    ValidationPrestataire,
    ListeCommandes,
  },
  data() {
    return {
      activeTab: 0,
      navItems: [
        { id: '0', label: 'Utilisateurs', icon: 'fas fa-users' },
        { id: '1', label: 'Catégories', icon: 'fas fa-tags' },
        { id: '2', label: 'Validation prestataires', icon: 'fas fa-user-check' },
        { id: '3', label: 'Commandes', icon: 'fas fa-shopping-cart' },
      ],
      tabs: [
        { label: 'Utilisateurs', component: 'GestionUtilisateur' },
        { label: 'Catégories des Prestations', component: 'GestionCategoriePrestation' },
        { label: 'Validation Prestataires', component: 'ValidationPrestataire' },
        { label: 'Liste des Commandes', component: 'ListeCommandes' },
      ],
    }
  },
}
</script>
