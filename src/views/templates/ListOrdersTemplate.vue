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
                <tr v-for="(commande, index) in paginatedCommandes" :key="index">
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

          <!-- Pagination locale -->
          <nav class="mt-3 d-flex justify-content-center">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="changePage(currentPage - 1)">Précédent</button>
              </li>

              <li
                v-for="page in totalPages"
                :key="page"
                class="page-item"
                :class="{ active: currentPage === page }"
              >
                <button class="page-link" @click="changePage(page)">{{ page }}</button>
              </li>

              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="changePage(currentPage + 1)">Suivant</button>
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
      const currentPage = ref(1)
      const pageSize = 5 // Nombre d'éléments par page

      const userId = JSON.parse(localStorage.getItem('auth_user_data'))?.id

      const fetchCommandes = async () => {
        loading.value = true
        try {
          const response = await api.get(`commande/client/${userId}/`)
          commandes.value = response.data.results // Si ton endpoint ne pagine pas côté backend
        } catch (error) {
          console.error("Erreur lors du chargement des commandes :", error)
        } finally {
          loading.value = false
        }
      }

      const paginatedCommandes = computed(() => {
        const start = (currentPage.value - 1) * pageSize
        return commandes.value.slice(start, start + pageSize)
      })

      const totalPages = computed(() => {
        return Math.ceil(commandes.value.length / pageSize)
      })

      const changePage = (page) => {
        if (page >= 1 && page <= totalPages.value) {
          currentPage.value = page
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

      return {
        commandes,
        paginatedCommandes,
        loading,
        currentPage,
        totalPages,
        changePage,
        formatDate,
        getStatutBadge
      }
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