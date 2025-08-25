<template>
  <div>
    <div v-if="paginatedPrestations.length" class="list-group">
      <div v-for="presta in paginatedPrestations" :key="presta.id" class="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between mb-2">
            <span class="fw-bold text-primary">{{ presta.titre }}</span>
            <small class="text-muted">{{ formatDate(presta.date_demande) }}</small>
          </div>
          <div class="mb-1">
            <span class="fw-semibold">Client :</span> {{ presta.client_username }}
          </div>
          <div class="mb-2">
            <span class="fw-semibold">Description :</span> {{ presta.description }}
          </div>

          <div>
            <!-- Afficher le bouton "Accepter" uniquement si la prestation est en attente et sans prestataire -->
            <button class="btn btn-sm btn-success me-2" @click="accepterPrestation(presta)" :disabled="presta.loading">
              {{ presta.loading ? 'Traitement...' : 'Accepter' }}
            </button>

            <!-- Afficher le bouton "Refuser" uniquement si la prestation est en attente et déjà assignée -->
            <button v-if="presta.statut === 'en_attente' && (presta.prestataire || presta.prestataire_cible)" class="btn btn-sm btn-danger" @click="RefuserPrestation(presta)" :disabled="presta.loading">
              {{ presta.loading ? 'Traitement...' : 'Refuser' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-info">Aucune prestation reçue.</div>

    <!-- Pagination -->
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
    name: 'PrestationsRecues',
    data() {
      return {
        prestations: [],
        currentPage: 1,
        itemsPerPage: 4,
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
      },
      getStatutClass(statut) {
        switch (statut) {
          case 'en_attente':
            return 'bg-warning text-dark'
          case 'accepte':
            return 'bg-primary'
          case 'terminee':
            return 'bg-success'
          case 'annulee':
            return 'bg-danger'
          default:
            return 'bg-secondary'
        }
      },
      getStatutLabel(statut) {
        switch (statut) {
          case 'en_attente':
            return 'En attente'
          case 'accepte':
            return 'Acceptée'
          case 'terminee':
            return 'Terminée'
          case 'annulee':
            return 'Annulée'
          default:
            return statut
        }
      },
      async accepterPrestation(presta) {
        const result = await Swal.fire({
          title: 'Accepter cette prestation ?',
          text: 'Souhaites-tu accepter cette demande de prestation ?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Oui, accepter',
          cancelButtonText: 'Annuler',
          confirmButtonColor: '#198754',
        })

        if (!result.isConfirmed) return

        try {
          presta.loading = true
          const res = await api.post(`/prestation/accepter/${presta.id}/`)
          presta.statut = 'accepte'

          Swal.fire({
            title: 'Acceptée !',
            text: res.data.message || 'La prestation a été acceptée avec succès.',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
          })

        } catch (error) {
          const msg = error.response?.data?.error || "Erreur lors de l'acceptation."
          Swal.fire({
            title: 'Erreur',
            text: msg,
            icon: 'error',
          })
        } finally {
          presta.loading = false
        }
      },
      async RefuserPrestation(presta) {
        const result = await Swal.fire({
          title: 'Confirmer le refus',
          text: 'Es-tu sûr de vouloir refuser cette prestation ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, refuser',
          cancelButtonText: 'Annuler',
          confirmButtonColor: '#dc3545',
        })

        if (!result.isConfirmed) return

        try {
          presta.loading = true
          await api.post(`/prestation/refuser_prestation/${presta.id}/`)
          presta.statut = 'refusee'
          Swal.fire('Refusée', 'La prestation a été refusée.', 'success')
        } catch (error) {
          const msg = error.response?.data?.error || "Erreur lors du refus."
          Swal.fire('Erreur', msg, 'error')
        } finally {
          presta.loading = false
        }
      },
    },
    async mounted() {
      try {
        const userData = JSON.parse(localStorage.getItem('auth_user_data'))
        if (!userData || !userData.id) throw new Error("Utilisateur non connecté.")

        const id = userData.id
        
        const res = await api.get(`/prestation/prestataire/${id}`)

        this.prestations = res.data.prestations.map(p => ({ ...p, loading: false }))
      } catch (error) {
        console.error("Erreur lors du chargement des prestations :", error)
      }
    },
  }
</script>