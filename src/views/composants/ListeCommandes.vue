<template>
  <div class="card shadow-sm">
    <div class="card-header bg-primary text-white fw-bold">
      Liste des Commandes
    </div>
    <div class="card-body">
      <!-- Loader -->
      <div v-if="loading" class="text-center py-3">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>

      <!-- Message d'erreur -->
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- Tableau -->
      <div v-else>
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Titre de la prestation</th>
              <th>Date de la commande</th>
              <th>Client</th>
              <th>Prestataire</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(commande, index) in commandes" :key="commande.id">
              <td>{{ index + 1 }}</td>
              <td>{{ commande.titre_prestation }}</td>
              <td>{{ formatDate(commande.date_commande) }}</td>
              <td>
                <span v-if="commande.prestataire">
                  {{ commande.prestataire.nom }} {{ commande.prestataire.prenom }}
                </span>
                <span v-else class="text-muted">Non assigné</span>
              </td>
              <td>
                <span
                  class="badge"
                  :class="{
                    'bg-warning text-dark': commande.statut === 'en_attente',
                    'bg-success': commande.statut === 'acceptee',
                    'bg-danger': commande.statut === 'refusee',
                    'bg-secondary': commande.statut === 'terminee'
                  }"
                >
                  {{ commande.statut }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Si aucune commande -->
        <div v-if="commandes.length === 0" class="text-center text-muted py-3">
          Aucune commande trouvée.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../services/api'

  export default {
    name: "ListeCommandes",
    data() {
      return {
        commandes: [],
        loading: false,
        error: null,
      }
    },
    methods: {
      async fetchCommandes() {
        this.loading = true
        this.error = null
        try {
          const response = await api.get("/commande/detail_commande/")
          this.commandes = response.data
        } catch (err) {
          this.error = "Impossible de charger les commandes.", err
          // console.log(this.error, err)
        } finally {
          this.loading = false
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      },
    },
    mounted() {
      this.fetchCommandes()
    },
  }
</script>
