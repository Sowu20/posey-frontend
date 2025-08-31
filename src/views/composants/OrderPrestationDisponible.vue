<template>

  <div class="container py-4">
    <!-- <h2 class="mb-4 text-primary fw-bold">Prestations disponibles dans ma catégorie</h2> -->

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else>
      <div v-if="prestations.length">
        <div v-for="presta in prestations" :key="presta.id" class="card shadow-sm mb-3">
          <div class="card-body">
            <h5 class="card-title text-primary">{{ presta.titre }}</h5>
            <p class="card-text">{{ presta.description }}</p>
            <p class="fw-bold">Prix : {{ presta.prix }} FCFA</p>
            <button class="btn btn-success btn-sm" @click="accepter(presta.id)">
              Accepter
            </button>
          </div>
        </div>
      </div>
      <div v-else class="alert alert-info">
        Aucune prestation disponible pour le moment.
      </div>
    </div>
  </div>

</template>

<script>
  import api from '../services/api';

  export default {
    name: 'OrderPrestationDisponible',
    data() {
      return {
        prestations: [],
        loading: true,
      };
    },
    methods: {
      async fetchPrestations() {  
        try {
        const user = JSON.parse(localStorage.getItem('auth_user_data'))
        if (!user?.id || !user?.access) return

        const res = await api.get(`commande/prestations_disponibles/`, {
          headers: { Authorization: `Bearer ${user.access}` }
        })
        this.prestations = res.data;
        } catch (error) {
          console.error("Erreur lors de l'affichage des prestations disponible", error)
        } finally {
          this.loading = false;
        }
      },
      async accepter(prestaId) {
        try {
          const user = JSON.parse(localStorage.getItem('auth_user_data'))
          if (!user?.id || !user?.access) return

          await api.post(`commande/${prestaId}/accepter/`,{},
            { headers: { Authorization: `Bearer ${user.access}` }, }
          );
          this.prestations = this.prestations.filter((p) => p.id != prestaId);
          alert("Commande acceptée avec succès !");
        } catch (error) {
          console.error("Erreur lors de l'acceptation de la commande", error)
        }
      },
      mounted() {
        this.fetchPrestations();
      }
    }
  }
</script>