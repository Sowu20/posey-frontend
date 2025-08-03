<template>
  <div class="container py-4">
    <h4 class="mb-4 fw-bold">Tableau de bord Administrateur</h4>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item" v-for="(tab, index) in tabs" :key="index">
        <a class="nav-link" :class="{ active: activeTab === index }" @click="activeTab = index">
          {{ tab.label }}
        </a>
      </li>
    </ul>

    <div>
      <component :is="tabs[activeTab].component" />
    </div>
  </div>
</template>

<script>
  import GestionUtilisateur from '../composants/GestionUtilisateur.vue'
  import GestionCategoriePrestation from '../composants/GestionCategoriePrestation.vue'
  import ValidationPrestataire from '../composants/ValidationPrestataire.vue'
  import ListeCommandes from '../composants/ListeCommandes.vue'

  export default {
    name: 'DashboardAdminTemplate',
    components: {
      GestionUtilisateur,
      GestionCategoriePrestation,
      ValidationPrestataire,
      ListeCommandes
    },
    data() {
      return {
        activeTab: 0,
        tabs: [
          { label: 'Utilisateurs', component: 'GestionUtilisateur' },
          { label: 'Catégories des Prestations', component: 'GestionCategoriePrestation' },
          { label: 'Validation Prestataires', component: 'ValidationPrestataire' },
          { label: 'Liste des Commandes', component: 'ListeCommandes' },
        ]
      }
    }
  }
</script>