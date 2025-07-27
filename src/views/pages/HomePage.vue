<template>
  <default-layout>
      <section class="bg-primary text-white py-5">
        <div class="container text-center">
          <h1 class="display-4 fw-bold mb-4">Nous donnons vie à vos projets !</h1>
          <p class="lead mb-4">
            Trouvez facilement des prestataires de services qualifiés près de chez vous.
            Maçons, menuisiers, plombiers et bien plus encore.
          </p>
          <div class="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <a href="/recherche_prestataire" class="btn btn-light text-primary fw-semibold px-4">
              Rechercher un prestataire
            </a>
            <!-- Affichage conditionnel du lien tableau de bord pour les clients -->
            <router-link v-if="user && user.role === 'client'" to="/dashboard_client" class="btn btn-outline-light fw-semibold px-4">
              Mon Tableau de bord
            </router-link>
            <router-link v-else to="/dashboard_provider" class="btn btn-outline-light fw-semibold px-4">
              Mon Tableau de bord
            </router-link>
          </div>
        </div>
      </section>

      <!-- Catégories Section -->
      <section class="py-5 bg-light">
        <div class="container">
          <h2 class="text-center mb-4">Nos catégories de services</h2>
          <div class="row g-4">
            <div class="col-6 col-md-4 col-lg-2" v-for="categorie in categories" :key="categorie.id">
              <div class="card text-center h-100 shadow-sm hover-shadow">
                <div class="card-body d-flex flex-column justify-content-center align-items-center">
                  <i :class="getIconClass(categorie.nom)" class="fs-2 mb-3 text-primary"></i>
                  <h6 class="card-title text-dark">{{ categorie.nom }}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-5 bg-light">
        <div class="container">
          <h2 class="text-center fw-bold mb-5">Nos prestataires les mieux notés</h2>
          <div class="row g-4">
            <div class="col-md-6 col-lg-4" v-for="prestataire in topPrestataire" :key="prestataire.id">
              <div class="card h-100 shadow-sm border-0">
                <img :src="formatImage(prestataire.image) || '/img/default-avatar2.png'" :alt="prestataire.nom" class="card-img-top" style="height: 100px; object-fit: cover"/>
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title fw-semibold">{{ prestataire.nom }}</h5>
                  <p class="mb-2">{{ prestataire.categorie }}</p>
                  <div class="d-flex align-items-center mb-3">
                    <div class="text-warning me-2">
                      <span v-for="i in 5" :key="i" class="fs-5">
                        {{ i <= prestataire.moyenne_notes ? '★' : '☆' }}
                      </span>
                    </div>
                    <!-- <small class="text-muted">({{ provider.reviews }} avis)</small> -->
                  </div>
                  <button class="btn btn-primary mt-auto w-100">Contacter</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-5">
        <div class="container">
          <h2 class="text-center fw-bold mb-5">Comment ça marche ?</h2>
          <div class="row g-4">
            <div class="col-md-4 text-center">
              <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 64px; height: 64px;">
                <span class="fw-bold text-primary fs-4">1</span>
              </div>
              <h5 class="fw-semibold mb-3">Recherchez un prestataire</h5>
              <p class="text-muted">Trouvez le prestataire qui correspond à vos besoins parmi nos catégories.</p>
            </div>
            <div class="col-md-4 text-center">
              <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 64px; height: 64px;">
                <span class="fw-bold text-primary fs-4">2</span>
              </div>
              <h5 class="fw-semibold mb-3">Nous Contactez</h5>
              <p class="text-muted">Prenez contact avec le prestataire et planifiez votre intervention.</p>
            </div>
            <div class="col-md-4 text-center">
              <div class="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 64px; height: 64px;">
                <span class="fw-bold text-primary fs-4">3</span>
              </div>
              <h5 class="fw-semibold mb-3">Évaluez</h5>
              <p class="text-muted">Notez votre expérience pour aider la communauté.</p>
            </div>
          </div>
        </div>
      </section>
  </default-layout>
</template>

<script>
  import api from '../services/api'
  import DefaultLayout from './Layout.vue'
  import { ref, onMounted } from 'vue'

  export default {
    name: 'HomePage',
    components: {
      DefaultLayout,
    },
    computed: {
      user() {
        const auth_user = localStorage.getItem('auth_user_data')
        return auth_user ? JSON.parse(auth_user) : null;
      },
    },
    setup() {
      const categories = ref([])
      const topPrestataire = ref([])

      const formatImage = (imagePath) => {
        if (!imagePath) return '/img/default-avatar.png'
        if (imagePath.startsWith('http')) return imagePath
        return `http://127.0.0.1:8000${imagePath}`
      }

    onMounted(async() => {
      try {
        const [categoriesResponse, prestatairesResponse] = await Promise.all([
          api.get('prestation/detail_categorie/'),
          api.get('note/prestataires/top-notes/')
        ])
        categories.value = categoriesResponse.data
        topPrestataire.value = prestatairesResponse.data
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur :", error)
      }
    })

    return { categories, topPrestataire, formatImage}
    },
    methods: {
      getIconClass(nom) {
        const icons = {
          'Électricité': 'fas fa-bolt',
          'Menuiserie': 'fas fa-hammer',
          'Maçonnerie': 'fas fa-person-digging',
          'Assistance virtuelle': 'fas fa-house-laptop',
          'Informatique & Réseaux': 'fas fa-network-wired',
        }
        return icons[nom] || 'fas fa-question-circle'
      },
    },
  }
</script>

<style scoped>
  .hover-shadow:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
  }
</style>