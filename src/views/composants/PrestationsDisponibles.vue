<template>
  <div>
    <div v-if="prestations.length" class="list-group">
      <div
        v-for="presta in prestations"
        :key="presta.id"
        class="list-group-item"
      >
        <div class="fw-bold">{{ presta.titre }}</div>
        <p class="mb-1">{{ presta.description }}</p>
        <div class="d-flex justify-content-between align-items-center">
          <span class="badge bg-primary">{{ presta.prix }} FCFA</span>
          <button class="btn btn-sm btn-outline-success">Accepter</button>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-info">
      Aucune prestation disponible actuellement.
    </div>
  </div>
</template>

<script>
  import api from '../services/api'

  export default {
    name: 'PrestationsDisponibles',
    data() {
      return {
        prestations: [],
      }
    },
    async mounted() {
      try {
        const userData = JSON.parse(localStorage.getItem('auth_user_data'))
        if (!userData || !userData.id) throw new Error("Utilisateur non connecté.")

        // const id = userData.id

        const res = await api.get(`/prestation/prestations_disponibles/`)
        this.prestations = res.data
      } catch (error) {
        console.error("Erreur chargement des données client:", error)
      }
    },
  }
</script>