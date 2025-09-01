<template>
  <div class="container py-4">
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else>
      <div v-if="paginatedPrestations.length">
        <div v-for="presta in paginatedPrestations" :key="presta.id" class="card shadow-sm mb-3">
          <div class="card-body">
            <h5 class="card-title text-primary">{{ presta.titre }}</h5>
            <p class="card-text">{{ presta.description }}</p>
            <!-- <p class="fw-bold">Prix : {{ presta.prix }} FCFA</p> -->
            <button class="btn btn-success btn-sm" @click="accepter(presta.id)">
              Accepter
            </button>
          </div>
        </div>

        <!-- Pagination -->
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

      <div v-else class="alert alert-info">
        Aucune prestation disponible pour le moment.
      </div>
    </div>
  </div>
</template>

<script>
  import api from "../services/api";

  export default {
    name: "PrestationsDisponibles",
    data() {
      return {
        prestations: [],
        loading: true,
        currentPage: 1,
        perPage: 3,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.prestations.length / this.perPage);
      },
      paginatedPrestations() {
        const start = (this.currentPage - 1) * this.perPage;
        const end = start + this.perPage;
        return this.prestations.slice(start, end);
      },
    },
    methods: {
      async fetchPrestations() {
        try {
          const user = JSON.parse(localStorage.getItem("auth_user_data"));
          if (!user?.id || !user?.access) return;

          const response = await api.get(`commande/prestations_disponibles/`, {
            headers: { Authorization: `Bearer ${user.access}` },
          });
          this.prestations = response.data;
        } catch (err) {
          console.error(err);
        } finally {
          this.loading = false;
        }
      },
      async accepter(prestaId) {
        try {
          const user = JSON.parse(localStorage.getItem("auth_user_data"));
          if (!user?.id || !user?.access) return;

          await api.post(
            `commande/${prestaId}/accepter/`,
            {},
            { headers: { Authorization: `Bearer ${user.access}` } }
          );

          this.prestations = this.prestations.filter((p) => p.id !== prestaId);

          // si plus d’éléments sur la page actuelle → revenir à la page précédente
          if (this.paginatedPrestations.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }

          alert("Prestation acceptée avec succès !");
        } catch (err) {
          console.error(err);
          alert("Erreur lors de l'acceptation");
        }
      },
      changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
        }
      },
    },
    mounted() {
      this.fetchPrestations();
    },
  };
</script>