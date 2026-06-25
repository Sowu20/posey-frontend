<template>
  <default-layout>
    <!-- Hero -->
    <section class="hero-section text-center">
      <div class="hero-overlay"></div>
      <div class="container position-relative py-5">
        <h1 class="display-4 fw-bold mb-3">
          Trouvez le prestataire idéal<br />pour tous vos projets
        </h1>
        <p class="lead posey-text-muted mb-4 mx-auto" style="max-width: 640px;">
          Recherchez, comparez et réservez des professionnels qualifiés près de chez vous.
        </p>
        <form class="hero-search mx-auto" @submit.prevent="goSearch">
          <i class="fas fa-search search-icon"></i>
          <input
            v-model="searchQuery"
            type="text"
            class="posey-input flex-grow-1 border-0"
            placeholder="Quel service recherchez-vous ? (ex: Plombier, Électricien...)"
          />
          <button type="submit" class="posey-btn-primary">Rechercher</button>
        </form>
        <div class="d-flex flex-wrap justify-content-center gap-3 mt-4">
          <router-link to="/recherche_prestataire" class="posey-btn-outline text-decoration-none">
            Parcourir les prestataires
          </router-link>
          <router-link
            v-if="user && user.role === 'client'"
            to="/dashboard_client"
            class="posey-btn-primary text-decoration-none"
          >
            Mon tableau de bord
          </router-link>
          <router-link
            v-else-if="user"
            to="/dashboard_provider"
            class="posey-btn-primary text-decoration-none"
          >
            Mon tableau de bord
          </router-link>
        </div>
      </div>
    </section>

    <!-- Catégories -->
    <section class="py-5">
      <div class="container">
        <h2 class="posey-section-title text-center">Nos catégories de services</h2>
        <p class="posey-section-subtitle text-center">Explorez nos domaines d'expertise</p>
        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3">
          <div class="col" v-for="categorie in categories" :key="categorie.id">
            <div class="posey-card p-4 text-center h-100 category-card">
              <i :class="getIconClass(categorie.nom)" class="fs-2 mb-3 posey-text-primary"></i>
              <h6 class="mb-0">{{ categorie.nom }}</h6>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Comment ça marche -->
    <section class="py-5" style="background: var(--posey-bg-card);">
      <div class="container">
        <h2 class="posey-section-title text-center">Simple, rapide et fiable</h2>
        <p class="posey-section-subtitle text-center">
          Notre plateforme vous guide à chaque étape pour une expérience sans tracas.
        </p>
        <div class="row g-4 text-center">
          <div class="col-md-4">
            <div class="step-icon mx-auto mb-3"><i class="fas fa-search"></i></div>
            <h5 class="fw-semibold mb-2">Recherchez</h5>
            <p class="posey-text-muted">Trouvez le prestataire qui correspond à vos besoins parmi nos catégories.</p>
          </div>
          <div class="col-md-4">
            <div class="step-icon mx-auto mb-3"><i class="fas fa-list-check"></i></div>
            <h5 class="fw-semibold mb-2">Comparez</h5>
            <p class="posey-text-muted">Consultez les avis, profils et tarifs pour faire le bon choix.</p>
          </div>
          <div class="col-md-4">
            <div class="step-icon mx-auto mb-3"><i class="fas fa-check-circle"></i></div>
            <h5 class="fw-semibold mb-2">Réservez</h5>
            <p class="posey-text-muted">Commandez en toute confiance et évaluez votre expérience.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Top prestataires -->
    <section class="py-5">
      <div class="container">
        <h2 class="posey-section-title text-center">Ils nous font confiance</h2>
        <p class="posey-section-subtitle text-center">Nos prestataires les mieux notés</p>
        <div class="row g-4">
          <div class="col-md-4" v-for="prestataire in topPrestataire" :key="prestataire.id">
            <div class="posey-card h-100 overflow-hidden">
              <img src="/img/default-avatar2.png" :alt="prestataire.nom" class="provider-img" />
              <div class="p-4">
                <h5 class="fw-semibold mb-1">{{ prestataire.nom }}</h5>
                <p class="posey-text-primary small mb-2">{{ prestataire.categorie }}</p>
                <div class="posey-stars mb-3">
                  <span v-for="i in 5" :key="i">{{ i <= prestataire.moyenne_notes ? '★' : '☆' }}</span>
                </div>
                <button
                  class="posey-btn-primary w-100"
                  @click="$router.push({ name: 'prestataire', params: { id: prestataire.id } })"
                >
                  Voir le profil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Prestataire -->
    <section class="py-5">
      <div class="container">
        <div class="cta-card text-center p-5">
          <h2 class="fw-bold mb-3">Vous êtes un professionnel ?</h2>
          <p class="mb-4 opacity-75">Rejoignez POSEY et développez votre activité auprès de nouveaux clients.</p>
          <router-link to="/register" class="btn btn-light fw-semibold px-4 py-2 text-decoration-none">
            Devenir prestataire
          </router-link>
        </div>
      </div>
    </section>
  </default-layout>
</template>

<script>
import api from '../services/api'
import DefaultLayout from './Layout.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'HomePage',
  components: { DefaultLayout },
  computed: {
    user() {
      const auth_user = localStorage.getItem('auth_user_data')
      return auth_user ? JSON.parse(auth_user) : null
    },
  },
  setup() {
    const router = useRouter()
    const categories = ref([])
    const topPrestataire = ref([])
    const searchQuery = ref('')

    const goSearch = () => {
      router.push({ path: '/recherche_prestataire', query: searchQuery.value ? { q: searchQuery.value } : {} })
    }

    onMounted(async () => {
      try {
        const [categoriesResponse, prestatairesResponse] = await Promise.all([
          api.get('prestation/detail_categorie/'),
          api.get('note/prestataires/top-notes/'),
        ])
        categories.value = categoriesResponse.data
        topPrestataire.value = prestatairesResponse.data
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error)
      }
    })

    return { categories, topPrestataire, searchQuery, goSearch }
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
      return icons[nom] || 'fas fa-briefcase'
    },
  },
}
</script>

<style scoped>
.hero-section {
  position: relative;
  background: url('/img/default-avatar2.png') center/cover no-repeat;
  min-height: 480px;
  display: flex;
  align-items: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(11, 17, 32, 0.92), rgba(37, 99, 235, 0.35));
}

.hero-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 680px;
  background: var(--posey-bg-card);
  border: 1px solid var(--posey-border);
  border-radius: var(--posey-radius);
  padding: 0.5rem 0.5rem 0.5rem 1rem;
}

.search-icon {
  color: var(--posey-text-muted);
}

.category-card {
  transition: transform 0.2s, border-color 0.2s;
  cursor: default;
}

.category-card:hover {
  transform: translateY(-4px);
  border-color: var(--posey-primary);
}

.step-icon {
  width: 64px;
  height: 64px;
  background: rgba(37, 99, 235, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--posey-primary);
}

.provider-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.cta-card {
  background: linear-gradient(135deg, var(--posey-primary), #1d4ed8);
  border-radius: var(--posey-radius);
}
</style>
