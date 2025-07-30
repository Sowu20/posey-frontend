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
              <tbody v-if="commandesPagines.length">
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
          <div class="mt-5 w-100 d-flex justify-content-center" v-if="totalPages > 1">
            <nav class="d-flex gap-2 align-items-center">
              <button class="btn btn-outline-primary" :disabled="currentPage === 1" @click="changerPage(currentPage - 1)">
                &lt;
              </button>
              <button v-for="pageNum in totalPages" :key="pageNum" @click="changerPage(pageNum)" :class="[ 'btn', currentPage === pageNum ? 'btn-primary text-white' : 'btn-outline-primary' ]">
                {{ pageNum }}
              </button>
              <button class="btn btn-outline-primary" :disabled="currentPage === totalPages" @click="changerPage(currentPage + 1)">
                &gt;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../services/api'
  import { ref, computed, onMounted, watch } from 'vue'

  export default {
    name: 'ListOrdersTemplate',
    setup() {
      const commandes = ref([])
      const loading = ref(true)
      const currentPage = ref(1)
      const commandesParPage = 4

      const userId = JSON.parse(localStorage.getItem('auth_user_data'))?.id

      const fetchCommandes = async () => {
        loading.value = true
        try {
          const response = await api.get(`commande/client/${userId}/`)
          commandes.value = response.data.results || []
          console.log("Commandes reçues :", commandes.value.length)
        } catch (error) {
          console.error("Erreur lors du chargement des commandes :", error)
        } finally {
          loading.value = false
        }
      }

      const totalPages = computed(() => {
        return Math.ceil(commandes.value.length / commandesParPage)
      })

      const commandesPagines = computed(() => {
        const start = (currentPage.value - 1) * commandesParPage
        return commandes.value.slice(start, start + commandesParPage) // Correction : utiliser commandes.value au lieu de list
      })

      const changerPage = (p) => {
        if (p >= 1 && p <= totalPages.value) currentPage.value = p
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
        const options = {
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
        return new Date(dateStr).toLocaleDateString('fr-FR', options)
      }

      onMounted(() => {
        if (userId) fetchCommandes()
      })

      watch(commandes, (newVal) => {
        if (newVal.length && currentPage.value > totalPages.value) {
          currentPage.value = 1
        }
      })

      return { commandes, loading, currentPage, commandesPagines, totalPages, changerPage, formatDate, getStatutBadge }
    },
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