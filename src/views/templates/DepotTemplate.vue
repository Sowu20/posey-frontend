<template>
  <div class="posey-container py-5">
    <h2 class="fw-bold mb-1">Mon portefeuille</h2>
    <p class="posey-text-muted mb-4">Effectuez un dépôt et consultez votre historique de transactions.</p>

    <div class="row g-4">
      <div class="col-lg-6">
        <div class="posey-card p-4">
          <h5 class="fw-bold mb-4">Faire un dépôt</h5>
          <div class="mb-3">
            <label class="posey-form-label">Numéro de téléphone</label>
            <input type="tel" class="posey-input" placeholder="+228 XX XX XX XX" />
          </div>
          <div class="mb-4">
            <label class="posey-form-label">Montant (FCFA)</label>
            <input v-model="montant" type="number" class="posey-input" placeholder="5000" />
          </div>
          <div class="d-flex gap-3">
            <button class="posey-btn-primary flex-fill py-3" @click="depot('t-money')">
              <i class="fas fa-mobile-alt me-2"></i>TMoney
            </button>
            <button class="posey-btn-outline flex-fill py-3" style="border-color: #6f42c1; color: #c4b5fd;" @click="depot('flooz')">
              Flooz
            </button>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="posey-card p-4">
          <h5 class="fw-bold mb-4">Historique des transactions</h5>
          <div v-if="!transactions.length" class="posey-text-muted text-center py-4">
            Aucune transaction pour le moment.
          </div>
          <div v-else class="overflow-auto" style="max-height: 360px;">
            <div
              v-for="t in transactions"
              :key="t.id"
              class="d-flex justify-content-between align-items-center py-3 border-bottom"
              style="border-color: var(--posey-border) !important;"
            >
              <div>
                <div class="fw-semibold">{{ t.statut }}</div>
                <div class="posey-text-muted small">{{ t.date_transaction }}</div>
              </div>
              <div class="fw-bold posey-text-primary">{{ t.montant }} FCFA</div>
            </div>
          </div>
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
        if (!userData?.id) throw new Error('Utilisateur non connecté.')
        const response = await api.get(`portefeuille/transactions/${userData.id}/`)
        transactions.value = response.data
      } catch (error) {
        console.error('Erreur chargement transactions:', error)
      }
    })

    return { montant, transactions, depot }
  },
}
</script>
