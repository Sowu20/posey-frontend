<template>
  <div class="row text-center">
    <div class="col-md-4 p-3">
      <div class="card shadow-sm p-3">
        <h6 class="fw-bold">Prestations reçues</h6>
        <p class="fs-4 text-primary">{{ stats.total_prestations }}</p>
      </div>
    </div>
    <!-- <div class="col-md-4 p-3">
      <div class="card shadow-sm p-3">
        <h6 class="fw-bold">Prestations En attente</h6>
        <p class="fs-4 text-warning">{{ stats.prestations_en_attente }}</p>
      </div>
    </div> -->
    <div class="col-md-4 p-3">
      <div class="card shadow-sm p-4">
        <h6 class="fw-bold text-muted">Note</h6>
        <div class="d-flex align-items-center justify-content-center">
          <p class="fs-4 text-success mb-0 me-2">{{ noteFormatted }}</p>
          <div class="text-warning">
            <i v-for="star in 5" :key="star"
              :class="star <= Math.floor(note) ? 'fas fa-star' : 'far fa-star'">
            </i>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4 p-3">
      <div class="card shadow-sm p-3">
        <h6 class="fw-bold">Avis</h6>
        <p class="fs-4 text-success">{{ stats.total_avis }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../services/api'

  export default {
    name: 'PrestataireStats',
    data() {
      return {
        stats: {
          total_prestations: 0,
          prestations_en_attente: 0,
          total_avis: 0,
        },
        prestations: [],
        note: 0,
      }
    },
    computed: {
      noteFormatted() {
        return this.note > 0 ? this.note.toFixed(1): 'N/A'
      }
    },
    mounted() {
      this.loadStats()
    },
    methods: {
      async loadStats() {
        try {
          const userData = JSON.parse(localStorage.getItem('auth_user_data'))
          if (!userData || !userData.id) throw new Error("Utilisateur non connecté.")

          const userid = userData.id

          const [prestationResponse, avisResponse, noteResponse] = await Promise.all([
            api.get(`/prestation/stats/${userid}`),
            api.get(`/prestation/avis/${userid}`),
            api.get(`/note/prestataire-note/${userid}/`),
          ])

          this.stats = {
            total_prestations: prestationResponse.data.total_prestations || 0,
            prestations_en_attente: prestationResponse.data.prestations_en_attente || 0,
            total_avis: avisResponse.data.total_avis || 0,
          }

          this.note = noteResponse.data.moyenne_score || 0

        } catch (error) {
          console.error("Erreur chargement des données client:", error)
        }
      },
    },
  }
</script>