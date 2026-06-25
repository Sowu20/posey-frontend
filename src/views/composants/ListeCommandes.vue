<template>
  <div class="posey-card">
    <div class="p-4 border-bottom" style="border-color: var(--posey-border) !important;">
      <h5 class="fw-bold mb-0">Liste des commandes</h5>
    </div>
    <div class="p-4">
      <div v-if="loading" class="text-center py-3">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>

      <div v-else-if="error" class="posey-alert posey-alert-danger">{{ error }}</div>

      <div v-else>
        <div v-if="commandes.length === 0" class="text-center posey-text-muted py-4">
          Aucune commande trouvée.
        </div>

        <div v-else class="posey-table-wrap">
          <table class="posey-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Prestation</th>
                <th>Date</th>
                <th>Client</th>
                <th>Prestataire</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(commande, index) in commandes" :key="commande.id">
                <td>{{ index + 1 }}</td>
                <td>{{ commande.titre }}</td>
                <td>{{ formatDate(commande.date_commande) }}</td>
                <td>{{ commande.client }}</td>
                <td>
                  <span v-if="commande.prestataire">{{ commande.prestataire }}</span>
                  <span v-else class="posey-text-muted">Non assigné</span>
                </td>
                <td>
                  <span :class="statutClass(commande.statut)">{{ commande.statut }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'ListeCommandes',
  data() {
    return {
      commandes: [],
      loading: false,
      error: null,
    }
  },
  methods: {
    async fetchCommandes() {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/commande/detail_commande/')
        this.commandes = response.data
      } catch (err) {
        this.error = 'Impossible de charger les commandes.'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
    statutClass(statut) {
      const map = {
        en_attente: 'posey-badge posey-badge-warning',
        acceptee: 'posey-badge posey-badge-success',
        refusee: 'posey-badge posey-badge-danger',
        terminee: 'posey-badge posey-badge-neutral',
      }
      return map[statut] || 'posey-badge posey-badge-neutral'
    },
  },
  mounted() {
    this.fetchCommandes()
  },
}
</script>
