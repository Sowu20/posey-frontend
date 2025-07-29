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
                <tr v-for="commande in commandesPagines" :key="commande.id">
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
          <nav class="d-flex justify-content-center mt-4">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: page.value === 1 }">
                <button class="page-link" @click="changerPage(page.value - 1)">Précédent</button>
              </li>
              <li class="page-item" v-for="p in totalPages" :key="p" :class="{ active: page.value === p }">
                <button class="page-link" @click="changerPage(p)">{{ p }}</button>
              </li>
              <li class="page-item" :class="{ disabled: page.value === totalPages }">
                <button class="page-link" @click="changerPage(page.value + 1)">Suivant</button>
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
  import { ref, computed, onMounted } from 'vue'

  export default {
    name: 'ListOrdersTemplate',
    setup() {
      const commandes = ref([])
      const loading = ref(true)
      const page = ref(1)
      const commandesParPage = 4

      const userId = JSON.parse(localStorage.getItem('auth_user_data'))?.id

      const fetchCommandes = async () => {
        loading.value = true
        try {
          const response = await api.get(`commande/client/${userId}/`)
          commandes.value = response.data.results || []
        } catch (error) {
          console.error("Erreur lors du chargement des commandes :", error)
        } finally {
          loading.value = false
        }
      }

      const totalPages = computed(() => {
        return Math.ceil(commandes.value.length / commandesParPage) || 1
      })

      const commandesPagines = computed(() => {
        const start = (page.value - 1) * commandesParPage
        return commandes.value.slice(start, start + commandesParPage)
      })

      const changerPage = (nouvellePage) => {
        if (nouvellePage >= 1 && nouvellePage <= totalPages.value) {
          page.value = nouvellePage
        }
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

      return { commandes, loading, page, commandesPagines, totalPages, changerPage, formatDate, getStatutBadge }
    }
  }
</script>

<style scoped>
  .badge {
    font-size: 0.85rem;
    padding: 0.4em 0.6em;
  }
  .page-item.active .page-link {
    background-color: #0d6efd;
    border-color: #0d6efd;
    color: white;
  }
</style>