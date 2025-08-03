<template>
  <div class="container py-5">
    <h2 class="fw-bold mb-4">Demande de prestation</h2>

    <div class="bg-white p-4 rounded shadow-sm">
      <div class="mb-3">
        <label for="categorie">Catégorie</label>
        <select v-model="categorie" class="form-select">
          <option disabled value="">Choisissez une catégorie</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.nom">{{ cat.nom }}</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="description">Description</label>
        <textarea v-model="description" class="form-control" rows="4" placeholder="Décrivez votre besoin..."></textarea>
      </div>
      <button class="btn btn-primary" @click="envoyerDemande">Envoyer la demande</button>
    </div>
  </div>
</template>

<script>
  import api from '../services/api'
  import { ref, onMounted } from 'vue'

  export default {
    name: 'OrderTemplate',
    setup() {
      const categorie = ref('')
      const categories = ref([])
      const description = ref('')

      const envoyerDemande = () => {
        alert(`Demande envoyée (Catégorie : ${categorie.value}, Description : ${description.value})`)
      }

      onMounted(async () => {
        const res = await api.get('prestation/detail_categorie/')
        categories.value = res.data
      })

      return { categorie, categories, description, envoyerDemande }
    }
  }
</script>