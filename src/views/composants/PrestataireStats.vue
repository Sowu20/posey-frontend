<template>
  <div class="row g-3">
    <div class="col-md-4">
      <div class="stat-card">
        <div class="stat-label">Prestations reçues</div>
        <div class="stat-value posey-text-primary">{{ stats.total_prestations }}</div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="stat-card">
        <div class="stat-label">Note moyenne</div>
        <div class="d-flex align-items-center gap-2">
          <div class="stat-value">{{ noteFormatted }}</div>
          <div class="posey-stars">
            <i v-for="star in 5" :key="star" :class="star <= Math.floor(note) ? 'fas fa-star' : 'far fa-star'"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="stat-card">
        <div class="stat-label">Avis reçus</div>
        <div class="stat-value posey-text-primary">{{ stats.total_avis }}</div>
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
      stats: { total_prestations: 0, prestations_en_attente: 0, total_avis: 0 },
      note: 0,
    }
  },
  computed: {
    noteFormatted() {
      return this.note > 0 ? this.note.toFixed(1) : 'N/A'
    },
  },
  mounted() {
    this.loadStats()
  },
  methods: {
    async loadStats() {
      try {
        const userData = JSON.parse(localStorage.getItem('auth_user_data'))
        if (!userData?.id) throw new Error('Utilisateur non connecté.')
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
        console.error('Erreur chargement stats:', error)
      }
    },
  },
}
</script>
