<template>
  <div class="posey-container py-5">
    <h2 class="fw-bold mb-1">Mes commandes</h2>
    <p class="posey-text-muted mb-4">Suivez l'état de vos commandes en cours et passées.</p>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>

    <div v-else>
      <div v-if="commandes.length === 0" class="posey-card p-4 text-center posey-text-muted">
        Aucune commande pour le moment.
      </div>

      <div v-else>
        <div class="posey-table-wrap">
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
              <tr v-for="(commande, index) in commandes" :key="index">
                <td>{{ commande.prestation }}</td>
                <td>{{ formatDate(commande.date_commande) }}</td>
                <td>
                  <span :class="getStatutBadge(commande.statut)">{{ commande.statut }}</span>
                </td>
                <td>{{ commande.prestataire }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul class="posey-pagination">
          <li>
            <button @click="changePage(previous)" :disabled="!previous">Précédent</button>
          </li>
          <li>
            <button @click="changePage(next)" :disabled="!next">Suivant</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'
import { ref, onMounted } from 'vue'

export default {
  name: 'ListOrdersTemplate',
  setup() {
    const commandes = ref([])
    const loading = ref(true)
    const next = ref(null)
    const previous = ref(null)

    const userId = JSON.parse(localStorage.getItem('auth_user_data'))?.id?.access

    const fetchCommandes = async (url = null) => {
      loading.value = true
      try {
        const endpoint = url || `commande/client/${userId}/`
        const response = await api.get(endpoint)
        commandes.value = response.data.results
        next.value = response.data.next
        previous.value = response.data.previous
      } catch (error) {
        console.error('Erreur lors du chargement des commandes :', error)
      } finally {
        loading.value = false
      }
    }

    const changePage = (url) => {
      if (url) fetchCommandes(url)
    }

    const getStatutBadge = (statut) => {
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
    }

    const formatDate = (dateStr) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateStr).toLocaleDateString(undefined, options)
    }

    onMounted(() => {
      if (userId) fetchCommandes()
    })

    return { commandes, loading, next, previous, changePage, formatDate, getStatutBadge }
  },
}
</script>
