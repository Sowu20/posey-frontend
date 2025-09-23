<template>
  <div>
    <div v-if="paginatedPrestations.length" class="list-group">
      <div v-for="presta in paginatedPrestations" :key="presta.id"
        class="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-2">
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between mb-2">
            <span class="fw-bold text-danger">{{ presta.titre }}</span>
            <small class="text-muted">{{ formatDate(presta.date_demande) }}</small>
          </div>
          <div class="mb-1">
            <span class="fw-semibold">Client :</span> {{ presta.client_username }}
          </div>
          <div class="mb-2">
            <span class="fw-semibold">Description :</span> {{ presta.description }}
          </div>
          <div class="mb-2">
            <span class="fw-semibold">Statut :</span>
            <span class="badge bg-danger">
              Refusée
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-info">Aucune prestation refusée.</div>

    <!-- PAGINATION -->
    <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
      <button class="btn btn-outline-secondary me-2" :disabled="currentPage === 1" @click="currentPage--">
        ← Précédent
      </button>
      <span class="align-self-center">Page {{ currentPage }} / {{ totalPages }}</span>
      <button class="btn btn-outline-secondary ms-2" :disabled="currentPage === totalPages" @click="currentPage++">
        Suivant →
      </button>
    </div>
  </div>
</template>

<script>
  import api from '../services/api'
  import Swal from 'sweetalert2'

  export default {
    name: 'PrestationsRefusees',
    data() {
      return {
        prestations: [],
        currentPage: 1,
        itemsPerPage: 4
      }
    },
    computed: {
      totalPages() {
        return Math.ceil(this.prestations.length / this.itemsPerPage)
      },
      paginatedPrestations() {
        const start = (this.currentPage - 1) * this.itemsPerPage
        const end = start + this.itemsPerPage
        return this.prestations.slice(start, end)
      }
    },

    methods: {
      formatDate(dateStr) {
        if (!dateStr) return ''
        const options = {
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
        return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateStr))
      }
    },

    async mounted() {
      try {
        const res = await api.get('/prestation/refusees/toutes/')
        this.prestations = res.data.sort((a,b) => new Date(b.date_demande) - new Date(a.date_demande))

        // SweetAlert après chargement
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Prestations chargées !',
        //   text: `${res.data.length} prestation(s) refusée(s) récupérée(s).`,
        //   timer: 3000,
        //   showConfirmButton: false
        // })

      } catch (error) {
        console.error('Erreur lors du chargement des prestations refusées :', error)
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Impossible de charger les prestations refusées.",
          confirmButtonColor: '#dc3545'
        })
      }
    }
  }
</script>
