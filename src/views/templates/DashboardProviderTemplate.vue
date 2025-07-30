<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container">

      <div class="text-center mb-5">
        <img :src="formatImage(user.image) || 'img/default-avatar.pngg'" class="rounded-circle mb-3 border" width="100" height="100" />
        <h4 class="fw-bold mb-0">{{ user.prenom }} {{ user.nom }}</h4>
        <p class="text-muted">{{ user.email }}</p>
      </div>

      <!-- Menu -->
      <div class="d-flex justify-content-center gap-3 mb-4 flex-wrap">
        <button class="btn" :class="currentView === 'stats' ? 'btn-primary' : 'btn-outline-primary'" @click="currentView = 'stats'">Vue d’ensemble</button>
        <button class="btn" :class="currentView === 'recues' ? 'btn-primary' : 'btn-outline-primary'" @click="currentView = 'recues'">Prestations reçues</button>
        <button class="btn" :class="currentView === 'refusees' ? 'btn-primary' : 'btn-outline-primary'" @click="currentView = 'refusees'">Prestations refusées</button>
      </div>

      <!-- Affichage dynamique -->
      <PrestataireStats v-if="currentView === 'stats'" />
      <PrestationsRecues v-if="currentView === 'recues'" />
      <PrestationsRefusees v-if="currentView === 'refusees'" />

    </div>
  </div>
</template>

<script>
  import PrestataireStats from '../composants/PrestataireStats.vue'
  import PrestationsRecues from '../composants/PrestationsRecues.vue'
  import PrestationsRefusees from '../composants/PrestationsRefusees.vue'

  export default {
    name: 'DashboardProviderTemplate',
    components: {
      PrestataireStats,
      PrestationsRecues,
      PrestationsRefusees,
    },
    setup() {
      const formatImage = (imagePath) => {
        // Si pas d'image, retourner l'image par défaut
        if (!imagePath) return '/img/default-avatar.png';
        // Si l'URL est déjà complète (commence par http), la retourner telle quelle
        if (imagePath.startsWith('http')) return imagePath;
        // Si l'image commence par /media/, construire l'URL complète
        if (imagePath.startsWith('/media/')) {
          return `https://d0cb15f8ed4e.ngrok-free.app${imagePath}`;
        }
        // Si l'image ne commence pas par /, l'ajouter
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `https://d0cb15f8ed4e.ngrok-free.app${cleanPath}`;
      };

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