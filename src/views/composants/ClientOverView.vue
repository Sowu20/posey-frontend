<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-4" v-for="(item, index) in statsCards" :key="index">
        <div class="stat-card">
          <div class="stat-label">{{ item.label }}</div>
          <div class="stat-value">{{ item.value }}</div>
        </div>
      </div>
    </div>

    <div v-if="commandes && commandes.length" class="posey-card p-4">
      <h5 class="fw-bold mb-4">Mes commandes récentes</h5>
      <div class="table-responsive">
        <table class="posey-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Prestataire</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cmd in commandes.slice(0, 5)" :key="cmd.id">
              <td>{{ cmd.service_nom || cmd.nom || '—' }}</td>
              <td>{{ cmd.prestataire_nom || '—' }}</td>
              <td>{{ formatDate(cmd.date_creation || cmd.created_at) }}</td>
              <td>
                <span class="posey-badge" :class="statusClass(cmd.statut)">
                  {{ cmd.statut || 'En attente' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientOverview',
  props: {
    statsCards: Array,
    commandes: { type: Array, default: () => [] },
  },
  methods: {
    formatDate(d) {
      if (!d) return '—'
      return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    statusClass(statut) {
      const map = {
        termine: 'posey-badge-success',
        en_cours: 'posey-badge-info',
        en_attente: 'posey-badge-warning',
        nouveau: 'posey-badge-info',
        refuse: 'posey-badge-danger',
      }
      return map[statut] || 'posey-badge-warning'
    },
  },
}
</script>
