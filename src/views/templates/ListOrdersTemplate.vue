<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container">
      <!-- Chargement -->
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>

      <!-- Tableau des commandes -->
      <div v-else>
        <div v-if="commandes.length === 0" class="alert alert-info">
          Aucune commande faite pour le moment.
        </div>

        <div v-else>
          <div class="table-responsive">
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
                <tr v-for="(commande, index) in commandes" :key="index">
                  <td>{{ commande.prestation }}</td>
                  <td>{{ formatDate(commande.date_commande) }}</td>
                  <td>
                    <span :class="getStatutBadge(commande.statut)">
                      {{ commande.statut }}
                    </span>
                  </td>
                  <td>{{ commande.prestataire }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <nav class="mt-3 d-flex justify-content-center">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: !previous }">
                <button class="page-link" @click="changePage(previous)" :disabled="!previous">Précédent</button>
              </li>
              <li class="page-item" :class="{ disabled: !next }">
                <button class="page-link" @click="changePage(next)" :disabled="!next">Suivant</button>
              </li>
            </ul>
          </nav>
        </div>
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

      const userId = JSON.parse(localStorage.getItem('auth_user_data'))?.id ?.access

      const fetchCommandes = async (url = null) => {
        loading.value = true
        try {
          const endpoint = url || `commande/client/${userId}/`
          const response = await api.get(endpoint)

          commandes.value = response.data.results
          next.value = response.data.next
          previous.value = response.data.previous
        } catch (error) {
          console.error("Erreur lors du chargement des commandes :", error)
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
            return 'badge bg-warning text-dark'
          case 'accepte':
            return 'badge bg-primary'
          case 'succes':
            return 'badge bg-success'
          default:
            return 'badge bg-secondary'
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
    }
  }
</script>

<style scoped>
  .badge {
    font-size: 0.85rem;
    padding: 0.4em 0.6em;
  }
</style>