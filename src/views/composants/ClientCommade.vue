<template>
  <div class="container-fluid px-4 py-3">
    <h5 class="mb-3 fw-bold">Mes commandes</h5>

    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div v-else-if="commandes.length === 0" class="alert alert-info">
      Aucune commande faite pour le moment.
    </div>

    <div v-else class="table-responsive shadow-sm rounded">
      <table class="table table-bordered table-striped align-middle">
        <thead class="table-dark text-center">
          <tr>
            <th>Prestation</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Prestataire</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="commande in commandesPaginees" :key="commande.id" class="text-center">
            <td>{{ commande.prestation }}</td>
            <td>{{ formatDate(commande.date_commande) }}</td>
            <td>
              <span :class="getStatutBadge(commande.statut)">
                {{ commande.statut }}
              </span>
            </td>
            <td>{{ commande.prestataire }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav class="d-flex justify-content-center mt-4" v-if="totalPages > 1">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: page === 1 }">
          <button class="page-link" @click="changerPage(page - 1)">Précédent</button>
        </li>
        <li class="page-item" v-for="p in totalPages" :key="p" :class="{ active: p === page }">
          <button class="page-link" @click="changerPage(p)">{{ p }}</button>
        </li>
        <li class="page-item" :class="{ disabled: page === totalPages }">
          <button class="page-link" @click="changerPage(page + 1)">Suivant</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
  import api from '../services/api'

  export default {
    name: 'ClientCommandes',
    data() {
      return {
        commandes: [],
        loading: true,
        page: 1,
        commandesParPage: 5,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.commandes.length / this.commandesParPage);
      },
      commandesPaginees() {
        const start = (this.page - 1) * this.commandesParPage;
        return this.commandes.slice(start, start + this.commandesParPage);
      },
    },
    methods: {
      changerPage(nouvellePage) {
        if (nouvellePage >= 1 && nouvellePage <= this.totalPages) {
          this.page = nouvellePage;
        }
      },
      formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      },
      getStatutBadge(statut) {
        switch (statut) {
          case 'en attente': return 'badge bg-warning text-dark';
          case 'accepte': return 'badge bg-primary';
          case 'succes': return 'badge bg-success';
          default: return 'badge bg-secondary';
        }
      },
      async chargerCommandes() {
        try {
          const [usersRes, catsRes] = await Promise.all([
            api.get('user/detail/'),
            api.get('/prestation/detail_categorie/'),
          ])
          this.utilisateurs = usersRes.data
          this.categories = catsRes.data
          // this.commandes = response.data;
        } catch (error) {
          console.error('Erreur lors du chargement des commandes :', error);
        } finally {
          this.loading = false;
        }
      }
    },
    mounted() {
      this.chargerCommandes();
    }
  };
</script>

<style scoped>
  .table th,
  .table td {
    vertical-align: middle;
    font-size: 0.9rem;
    padding: 0.75rem;
  }

  .table thead th {
    font-weight: 600;
    text-transform: capitalize;
  }

  .pagination .page-link {
    border-radius: 0.25rem;
  }
</style>