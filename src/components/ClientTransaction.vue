<template>
  <div>
    <h5 class="mb-3 fw-bold">Historique des transactions</h5>
    <div v-if="transactions.length === 0" class="alert alert-info">
      Aucune transaction enregistrée pour le moment.
    </div>
    <div v-else class="overflow-auto" style="max-height: 400px">
      <div v-for="t in transactions" :key="t.id" class="border-bottom py-2 d-flex justify-content-between">
        <div>
          <div class="fw-semibold">{{ t.statut }}</div>
          <div class="text-muted small">{{ formatDate(t.date_transaction) }}</div>
        </div>
        <div>{{ t.montant }} FCFA</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ClientTransactions',
    props: ['transactions'],
    methods: {
      formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString()
      }
    }
  }
</script>