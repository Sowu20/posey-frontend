<template>
  <div>
    <h5 class="mb-3 fw-bold">Mes commandes</h5>
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    <div v-else-if="commandes.length === 0" class="posey-card p-4 text-center posey-text-muted">
      Aucune commande pour le moment.
    </div>
    <div v-else class="posey-table-wrap">
      <table class="posey-table">
        <thead>
          <tr>
            <th>Prestation</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Prestataire</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="commande in commandes" :key="commande.id">
            <td>{{ commande.prestation }}</td>
            <td>{{ formatDate(commande.date_commande) }}</td>
            <td><span :class="getStatutBadge(commande.statut)">{{ commande.statut }}</span></td>
            <td>{{ commande.prestataire }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientCommandes',
  props: ['commandes', 'loading'],
  methods: {
    getStatutBadge(statut) {
      switch (statut) {
        case 'en attente':
          return 'posey-badge posey-badge-warning'
        case 'accepte':
          return 'posey-badge posey-badge-info'
        case 'succes':
          return 'posey-badge posey-badge-success'
        default:
          return 'posey-badge posey-badge-neutral'
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
  },
}
</script>
