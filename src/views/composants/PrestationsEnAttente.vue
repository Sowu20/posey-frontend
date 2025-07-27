<template>
  <div>
    <!-- Liste des prestations -->
    <div v-if="prestations.length" class="list-group">
      <div v-for="presta in prestations" :key="presta.id" class="list-group-item">
        <div class="fw-bold">{{ presta.titre }}</div>
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <p class="mb-1">{{ presta.description }}</p>
          </div>
          <button class="btn btn-sm btn-outline-success" @click="accepterPrestation(presta.id)" :disabled="isLoading">
            <span v-if="isLoading && currentPrestationId === presta.id" class="spinner-border spinner-border-sm me-2"></span>
            {{ isLoading && currentPrestationId === presta.id ? 'Acceptation...' : 'Accepter' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Aucune prestation -->
    <div v-else-if="!isLoadingPrestations" class="alert alert-warning">
      Aucune prestation en attente.
    </div>

    <!-- Chargement initial -->
    <div v-else class="text-center py-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../services/api'
  import Swal from 'sweetalert2'

  export default {
    name: 'PrestationsEnAttente',
    data() {
      return {
        prestations: [],
        isLoadingPrestations: true,
        isLoading: false,
        currentPrestationId: null
      }
    },

    async mounted() {
      await this.loadPrestations()
    },

    methods: {
      async loadPrestations() {
        try {
          this.isLoadingPrestations = true
          const userData = JSON.parse(localStorage.getItem('auth_user_data'))
          if (!userData || !userData.id) {
            throw new Error("Utilisateur non connecté.")
          }

          const res = await api.get(`/prestation/prestataire/${userData.id}`)

          // Filtrage : prestations en attente sans prestataire
          this.prestations = res.data.prestations.filter(p =>
            p.statut === 'en_attente' && (!p.prestataire || p.prestataire === '')
          )
        } catch (error) {
          console.error("Erreur chargement des données:", error)
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: "Impossible de charger les prestations.",
          })
        } finally {
          this.isLoadingPrestations = false
        }
      },

      async accepterPrestation(prestationId) {
        const confirmation = await Swal.fire({
          title: 'Confirmer l’acceptation',
          text: 'Souhaitez-vous accepter cette prestation ?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Oui, accepter',
          cancelButtonText: 'Annuler',
          confirmButtonColor: '#198754'
        })

        if (!confirmation.isConfirmed) return

        try {
          this.isLoading = true
          this.currentPrestationId = prestationId

          const res = await api.post(`/prestation/${prestationId}/accepter/`)
          this.prestations = this.prestations.filter(p => p.id !== prestationId)

          Swal.fire({
            icon: 'success',
            title: 'Acceptée !',
            text: res.data.message || 'Prestation acceptée avec succès.',
            timer: 3000,
            showConfirmButton: false
          })

        } catch (error) {
          let msg = "Erreur lors de l'acceptation de la prestation."

          if (error.response?.status === 400) {
            msg = error.response.data.error || "Cette prestation n'est plus disponible."
          } else if (error.response?.status === 404) {
            msg = "Prestation introuvable."
          } else if (error.response?.status === 403) {
            msg = "Vous n'êtes pas autorisé à accepter cette prestation."
          }

          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: msg
          })

          await this.loadPrestations()
        } finally {
          this.isLoading = false
          this.currentPrestationId = null
        }
      }
    }
  }
</script>