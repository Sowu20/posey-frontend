<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container">
      <h2 class="mb-4 fw-bold">Mes commandes</h2>

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

        <!-- Bouton de commande
        <div class="text-end mt-4">
          <button class="btn btn-primary" @click="goToCreateCommande">
            Faire une commande
          </button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../services/api'
  import { ref, onMounted } from 'vue'
  // import { useRouter } from 'vue-router'

  export default {
    name: 'ListOrdersTemplate',
    setup() {
      const commandes = ref([])
      const loading = ref(true)
      // const router = useRouter()

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

      // const goToCreateCommande = () => {
      //   router.push('/commande/nouvelle') // 🔁 adapte selon ta route
      // }

      onMounted(async () => {
        try {
          const userData = JSON.parse(localStorage.getItem('auth_user_data'))
          if (!userData || !userData.id) throw new Error("Utilisateur non connecté.")

          const id = userData.id
          const response = await api.get(`commande/client/${id}/`)
          commandes.value = response.data
        } catch (error) {
          console.error("Erreur lors du chargement des commandes :", error)
        } finally {
          loading.value = false
        }
      })

      return { commandes, loading, formatDate, getStatutBadge }
    }
  }
</script>

<style scoped>
  .badge {
    font-size: 0.85rem;
    padding: 0.4em 0.6em;
  }
</style>