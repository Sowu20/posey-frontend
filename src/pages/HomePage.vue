<template>
  <default-layout>
    <section class="home-hero">
      <div class="home-hero__image"></div>
      <div class="container position-relative py-5">
        <div class="home-hero__content text-center mx-auto">
          <span class="home-eyebrow">La plateforme qui vous simplifie la vie</span>
          <h1>Trouvez le prestataire idéal pour tous vos projets</h1>
          <p>Recherchez, comparez et réservez des professionnels qualifiés près de chez vous.</p>
          <form class="home-search mx-auto" @submit.prevent="goSearch">
            <i class="fas fa-search" aria-hidden="true"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Quel service recherchez-vous ?"
              aria-label="Service recherché"
            />
            <button type="submit" class="posey-btn-primary">Rechercher</button>
          </form>
          <div class="d-flex flex-wrap justify-content-center gap-3 mt-4">
            <router-link to="/recherche_prestataire" class="posey-btn-outline text-decoration-none">
              Parcourir les prestataires
            </router-link>
            <router-link v-if="user" :to="user.role === 'client' ? '/dashboard_client' : '/dashboard_provider'" class="posey-btn-primary text-decoration-none">
              Mon tableau de bord
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="home-section home-section--light">
      <div class="container">
        <div class="home-section__heading">
          <h2>Simple, rapide et fiable</h2>
          <p>Notre plateforme vous guide à chaque étape pour une expérience sans tracas.</p>
        </div>
        <div class="row g-4">
          <div v-for="step in steps" :key="step.title" class="col-md-4">
            <article class="home-step h-100">
              <div class="home-step__icon"><i :class="step.icon" aria-hidden="true"></i></div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="home-section">
      <div class="container">
        <div class="home-section__heading">
          <h2>Nos catégories de services</h2>
          <p>Explorez les domaines d’expertise disponibles sur POSEY.</p>
        </div>
        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-3">
          <div v-for="categorie in categories" :key="categorie.id" class="col">
            <router-link to="/recherche_prestataire" class="home-category h-100">
              <i :class="getIconClass(categorie.nom)" aria-hidden="true"></i>
              <span>{{ categorie.nom }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section v-if="topPrestataire.length" class="home-section home-section--light">
      <div class="container">
        <div class="home-section__heading">
          <h2>Ils nous font confiance</h2>
          <p>Découvrez les prestataires les mieux notés par notre communauté.</p>
        </div>
        <div class="row g-4">
          <div v-for="prestataire in topPrestataire" :key="prestataire.id" class="col-md-4">
            <article class="home-provider h-100">
              <img src="/img/default-avatar2.png" :alt="prestataire.nom" />
              <div class="p-4">
                <h3>{{ prestataire.nom }}</h3>
                <p class="home-provider__category">{{ prestataire.categorie }}</p>
                <div class="posey-stars mb-3" aria-label="Note du prestataire">
                  <span v-for="i in 5" :key="i">{{ i <= prestataire.moyenne_notes ? '★' : '☆' }}</span>
                </div>
                <button class="posey-btn-primary w-100" @click="$router.push({ name: 'prestataire', params: { id: prestataire.id } })">
                  Voir le profil
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="home-section">
      <div class="container">
        <div class="home-cta text-center">
          <h2>Vous êtes un professionnel ?</h2>
          <p>Développez votre clientèle, gérez vos projets et rejoignez les prestataires de POSEY.</p>
          <router-link to="/register" class="btn btn-light fw-semibold px-4 py-2 text-decoration-none">Devenir prestataire</router-link>
        </div>
      </div>
    </section>
  </default-layout>
</template>

<script>
import api from '@/services/api'
import DefaultLayout from '@/layouts/Layout.vue'
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
    const steps = [
      { icon: 'fas fa-search', title: 'Recherchez', text: 'Décrivez votre besoin et découvrez une sélection de profils pertinents.' },
      { icon: 'fas fa-list-check', title: 'Comparez', text: 'Consultez les avis, portfolios et tarifs pour faire le meilleur choix.' },
      { icon: 'fas fa-check-circle', title: 'Réservez', text: 'Engagez votre prestataire en toute sécurité via notre plateforme.' },
    ]

    const goSearch = () => {
      router.push({
        path: '/recherche_prestataire',
        query: searchQuery.value ? { q: searchQuery.value } : {}
      })
    }

    onMounted(async () => {
      try {
        const [categoriesResponse, prestatairesResponse] = await Promise.all([
          api.get('prestation/detail_categorie'),
          api.get('note/prestataires/top-notes'),
        ])
        categories.value = categoriesResponse.data
        topPrestataire.value = prestatairesResponse.data
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error)
      }
    })

    return { categories, topPrestataire, searchQuery, steps, goSearch }
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

<style scoped src="../styles/pages/home-page.css"></style>
