<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container">
      <!-- Chargement -->
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>

      <!-- Tableau des commandes -->
      <div v-else>
        <div v-if="commandes.length === 0" class="alert alert-info">
          Aucune commande faite pour le moment.
        </div>

        <div v-else>
          <div class="table-responsive">
            <table class="table table-bordered table-striped align-middle">
              <thead class="table-dark">
                <tr>
                  <th>Prestation</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Prestataire</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="commande in commandesPagines" :key="commande.id">
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
          <div class="mt-5 w-100 d-flex justify-content-center" v-if="totalPages > 1">
            <nav class="d-flex gap-2 align-items-center">
              <button class="btn btn-outline-primary" :disabled="currentPage === 1" @click="changerPage(currentPage - 1)">
                &lt;
              </button>
              <button v-for="pageNum in totalPages" :key="pageNum" @click="changerPage(pageNum)" :class="['btn', currentPage === pageNum ? 'btn-primary text-white' : 'btn-outline-primary']">
                {{ pageNum }}
              </button>
              <button class="btn btn-outline-primary" :disabled="currentPage === totalPages" @click="changerPage(currentPage + 1)">
                &gt;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../services/api'

  export default {
    name: 'ListOrdersTemplate',
    data() {
      return {
        commandes: [],
        loading: true,
        currentPage: 1,
        commandesParPage: 4,
        userId: JSON.parse(localStorage.getItem('auth_user_data'))?.id || null,
      }
    },
    computed: {
      totalPages() {
        return Math.ceil(this.commandes.length / this.commandesParPage)
      },
      commandesPagines() {
        const start = (this.currentPage - 1) * this.commandesParPage
        return this.commandes.slice(start, start + this.commandesParPage)
      }
    },
    methods: {
      changerPage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page
        }
      },
      formatDate(dateStr) {
        const options = {
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
        return new Date(dateStr).toLocaleDateString('fr-FR', options)
      },
      getStatutBadge(statut) {
        switch (statut) {
          case 'en attente':
            return 'badge bg-warning text-dark'
          case 'accepte':
            return 'badge bg-primary'
          case 'succes':
            return 'badge bg-success'
          default:
            return 'badge bg-secondary'
        }
      },
      async fetchCommandes() {
        this.loading = true
        try {
          const response = await api.get(`commande/client/${this.userId}/`)
          this.commandes = response.data.results || []
        } catch (error) {
          console.error('Erreur lors du chargement des commandes :', error)
        } finally {
          this.loading = false
        }
      }
    },
    mounted() {
      if (this.userId) {
        this.fetchCommandes()
      }
    },
    watch: {
      commandes(newVal) {
        if (newVal.length && this.currentPage > this.totalPages) {
          this.currentPage = 1
        }
      }
    }
  }
</script>

<style scoped>
  .badge {
    font-size: 0.85rem;
    padding: 0.4em 0.6em;
  }
</style>