<template>
  <div class="p-4 bg-white rounded shadow-sm">

    <!-- Chargement -->
    <div v-if="loading" class="text-center">
      <span class="spinner-border text-primary"></span>
    </div>

    <!-- Liste des commandes -->
    <div v-else>
      <div v-if="commandes.length">
        <div v-for="commande in commandes" :key="commande.id" class="card mb-3 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ commande.titre }}</h5>
            <p class="card-text">{{ commande.description }}</p>
            <p><strong>Client :</strong> {{ commande.client }}</p>
            <p><strong>Prix :</strong> {{ commande.prix }} FCFA</p>
            <span class="badge" :class="commande.statut === 'accepte' ? 'bg-success' : 'bg-warning'">{{ commande.statut }}</span>
          </div>
        </div>
      </div>

      <!-- Aucun résultat -->
      <div v-else class="alert alert-info">
        Aucune commande ne vous a encore été assignée.
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../services/api';

  export default {
    name: "OrderListCommande",
    data() {
      return {
        commandes: [],
        loading: true,
      };
    },
    async mounted() {
      try {
        const user = JSON.parse(localStorage.getItem('auth_user_data'))
        if (!user?.id || !user?.access) return

        const response = await api.get(`commande/mes_commandes/`, {
          headers: { Authorization: `Bearer ${user.access}` }
        })
        this.commandes = response.data;
      } catch (error) {
        console.error("Erreur lors du chargement des commandes", error);
      } finally {
        this.loading = false;
      }
    },
  };
</script>

<style scoped>
  .card {
    border-radius: 12px;
  }
</style>
