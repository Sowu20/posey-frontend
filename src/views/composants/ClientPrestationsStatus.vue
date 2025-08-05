<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container">
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>

      <div v-else-if="prestations.length">
        <div class="row g-3">
          <div v-for="presta in paginatedPrestations" :key="presta.id" class="col-12">
            <div class="card h-100 shadow-sm border-0">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <h6 class="card-title fw-bold mb-0">{{ presta.titre }}</h6>
                  <span :class="getBadgeClass(presta.statut)">
                    {{ formatStatut(presta.statut) }}
                  </span>
                </div>
                <p class="mb-1"><strong>Catégorie :</strong> {{ presta.categorie || 'Non spécifiée' }}</p>
                <p class="mb-1">
                  <strong>Prestataire :</strong>
                  {{ presta.prestataire || 'Aucun prestataire assigné' }}
                </p>
                <p class="text-muted mb-0">
                  <small><i class="bi bi-calendar-event me-1"></i> {{ formatDate(presta.date_demande) }}</small>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
          <nav>
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="goToPage(currentPage - 1)">Précédent</button>
              </li>
              <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                <button class="page-link" @click="goToPage(page)">{{ page }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="goToPage(currentPage + 1)">Suivant</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div v-else class="alert alert-info text-center mt-4">
        Vous n'avez soumis aucune demande de prestation.
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../services/api'

  export default {
    name: 'ClientPrestationsStatus',
    data() {
      return {
        prestations: [],
        loading: true,
        currentPage: 1,
        perPage: 5
      }
    },
    computed: {
      paginatedPrestations() {
        const start = (this.currentPage - 1) * this.perPage
        const end = start + this.perPage
        return this.prestations.slice(start, end)
      },
      totalPages() {
        return Math.ceil(this.prestations.length / this.perPage)
      }
    },
    methods: {
      async fetchPrestations() {
        try {
          const userData = JSON.parse(localStorage.getItem('auth_user_data'))
          if (!userData || !userData.id) throw new Error('Utilisateur non connecté.')

          const res = await api.get(`/prestation/client/${userData.id}/`)
          this.prestations = res.data
        } catch (error) {
          console.error("Erreur lors du chargement des prestations :", error)
        } finally {
          this.loading = false
        }
      },
      goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page
        }
      },
      getBadgeClass(status) {
        switch (status) {
          case 'en_attente': return 'badge bg-warning text-dark'
          case 'accepte': return 'badge bg-primary'
          case 'terminee': return 'badge bg-success'
          case 'annulee': return 'badge bg-danger'
          case 'refusee': return 'badge bg-secondary'
          default: return 'badge bg-light text-dark'
        }
      },
      formatStatut(statut) {
        switch (statut) {
          case 'en_attente': return 'En attente'
          case 'accepte': return 'Acceptée'
          case 'terminee': return 'Terminée'
          case 'annulee': return 'Annulée'
          case 'refusee': return 'Refusée'
          default: return statut
        }
      },
      formatDate(dateStr) {
        if (!dateStr) return 'Date inconnue'
        const options = { year: 'numeric', month: 'short', day: 'numeric' }
        const date = new Date(dateStr)
        return isNaN(date) ? 'Date invalide' : date.toLocaleDateString('fr-FR', options)
      },
    },
    mounted() {
      this.fetchPrestations()
    }
  }
</script>

<style scoped>
  .card {
    transition: transform 0.2s ease;
  }
  .card:hover {
    transform: scale(1.02);
  }
</style>