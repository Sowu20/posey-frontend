<template>
  <div class="container py-5">
    <h2 class="fw-bold mb-4">Mon portefeuille</h2>

    <div class="bg-white rounded shadow-sm p-4 mb-4">
      <h5 class="mb-3">Faire un dépôt</h5>
      <input type="number" class="form-control mb-3" placeholder="Votre numéro de téléphone">
      <input v-model="montant" type="number" class="form-control mb-3" placeholder="Montant en FCFA" />
      <div class="d-flex gap-3">
        <button class="btn btn-warning w-100" @click="depot('t-money')">TMoney</button>
        <button class="btn w-100 text-white" style="background-color: #6f42c1;" @click="depot('flooz')">Flooz</button>
      </div>
    </div>

    <div class="bg-white rounded shadow-sm p-4">
      <h5 class="mb-3">Historique des transactions</h5>
      <div class="overflow-auto" style="max-height: 300px">
        <div v-for="t in transactions" :key="t.id" class="border-bottom py-2 d-flex justify-content-between">
          <div>
            <div class="fw-semibold">{{ t.statut }}</div>
            <div class="text-muted small">{{ t.date_transaction }}</div>
          </div>
          <div>{{ t.montant }} FCFA</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../services/api'
  import { ref, onMounted } from 'vue'

  export default {
    name: 'DepotTemplate',
    setup() {
      const montant = ref(0)
      const transactions = ref([])

      const depot = (moyen) => {
        alert(`Dépôt de ${montant.value} FCFA via ${moyen.toUpperCase()} (à implémenter)`)
      }

      onMounted(async () => {
        try {
          const userData = JSON.parse(localStorage.getItem('auth_user_data'))
          if (!userData || !userData.id) throw new Error("Utilisateur non connecté.")

          const id = userData.id

          const response = await api.get(`portefeuille/transactions/${id}/`)
          transactions.value = response.data
        } catch (error) {
          console.error('Erreur chargement transactions:', error)
        }
      })

      return { montant, transactions, depot }
    }
  }
</script>