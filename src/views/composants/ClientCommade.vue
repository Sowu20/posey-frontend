<template>
  <div>
    <h5 class="mb-3 fw-bold">Mes commandes</h5>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    <div v-else-if="commandes.length === 0" class="alert alert-info">
      Aucune commande faite pour le moment.
    </div>
    <div v-else class="table-responsive">
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
          case 'en attente': return 'badge bg-warning text-dark';
          case 'accepte': return 'badge bg-primary';
          case 'succes': return 'badge bg-success';
          default: return 'badge bg-secondary';
        }
      },
      formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      }
    }
  }
</script>