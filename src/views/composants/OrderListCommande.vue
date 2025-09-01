<template>
  <div class="p-4 bg-white rounded shadow-sm">

    <!-- Chargement -->
    <div v-if="loading" class="text-center">
      <span class="spinner-border text-primary"></span>
    </div>

    <!-- Liste des commandes -->
    <div v-else>
      <div v-if="paginatedCommandes.length">
        <div v-for="commande in paginatedCommandes" :key="commande.id" class="card mb-3 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ commande.titre }}</h5>
            <p class="card-text">{{ commande.description }}</p>
            <p><strong>Client :</strong> {{ commande.client }}</p>
            <p><strong>Prix :</strong> {{ commande.prix }} FCFA</p>
            <span class="badge" :class="commande.statut === 'accepte' ? 'bg-success' : 'bg-warning'">{{ commande.statut }}</span>
          </div>
        </div>
        <nav aria-label="Page navigation" class="d-flex justify-content-center mt-3">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }" @click="changePage(currentPage - 1)">
              <a class="page-link" href="#">Précédent</a>
            </li>

            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }" @click="changePage(page)">
              <a class="page-link" href="#">{{ page }}</a>
            </li>

            <li class="page-item" :class="{ disabled: currentPage === totalPages }" @click="changePage(currentPage + 1)">
              <a class="page-link" href="#">Suivant</a>
            </li>
          </ul>
        </nav>
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
        current: 1,
        perPage: 3,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.commandes.length / this.perPage);
      },
      paginatedCommandes() {
        const start = (this.currentPage - 1) * this.perPage;
        const end = start + this.perPage;
        return this.commandes.slice(start, end);
      },
    },
    async mounted() {
      try {
        const user = JSON.parse(localStorage.getItem('auth_user_data'))
        if (!user?.id || !user?.access) return

        const response = await api.get(`commande/mes_commandes/`, {
          headers: { Authorization: `Bearer ${user.access}` }
        })
        this.commandes = response.data;

        if (this.paginatedCommandes.length === 0 && this.currentPage > 1) {
          this.currentPage--;
        }
      } catch (error) {
        console.error("Erreur lors du chargement des commandes", error);
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  };
</script>

<style scoped>
  .card {
    border-radius: 12px;
  }
</style>
