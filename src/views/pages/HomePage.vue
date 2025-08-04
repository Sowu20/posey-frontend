<template>
  <default-layout>
    <!-- Section Hero -->
    <section class="bg-primary text-white text-center py-5">
      <div class="container-fluid px-4">
        <h1 class="display-4 fw-bold mb-4">Nous donnons vie à vos projets !</h1>
        <p class="lead mb-4">
          Trouvez facilement des prestataires de services qualifiés près de chez vous.
          Maçons, menuisiers, plombiers et bien plus encore.
        </p>
        <div class="d-flex flex-column flex-sm-row justify-content-center gap-3">
          <a href="/recherche_prestataire" class="btn btn-light text-primary fw-semibold px-4">
            Rechercher un prestataire
          </a>
          <router-link v-if="user && user.role === 'client'" to="/dashboard_client" class="btn btn-outline-light fw-semibold px-4">
            Mon Tableau de bord
          </router-link>
          <router-link v-else to="/dashboard_provider" class="btn btn-outline-light fw-semibold px-4">
            Mon Tableau de bord
          </router-link>
        </div>
      </div>
    </section>

    <!-- Section Catégories -->
    <section>
      <div class="container-fluid px-4">
        <h2>Nos catégories de services</h2>
        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-4">
          <div class="col" v-for="categorie in categories" :key="categorie.id">
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

    <!-- Section Top Prestataires -->
    <section>
      <div class="container-fluid px-4">
        <h2>Nos prestataires les mieux notés</h2>
        <div class="row g-4">
          <div class="col-sm-12 col-md-6 col-lg-4" v-for="prestataire in topPrestataire" :key="prestataire.id">
            <div class="card h-100 shadow-sm border-0">
              <img src="/img/default-avatar2.png" :alt="prestataire.nom" class="card-img-top" />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title fw-semibold">{{ prestataire.nom }}</h5>
                <p class="mb-2">{{ prestataire.categorie }}</p>
                <div class="d-flex align-items-center mb-3">
                  <div class="text-warning me-2">
                    <span v-for="i in 5" :key="i" class="fs-5">
                      {{ i <= prestataire.moyenne_notes ? '★' : '☆' }}
                    </span>
                  </div>
                </div>
                <button class="btn btn-primary mt-auto w-100">Contacter</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Fonctionnement -->
    <section>
      <div class="container-fluid px-4">
        <h2>Comment ça marche ?</h2>
        <div class="row g-4 text-center">
          <div class="col-md-4">
            <div class="bg-step text-primary">1</div>
            <h5 class="fw-semibold mb-3">Recherchez un prestataire</h5>
            <p class="text-muted">Trouvez le prestataire qui correspond à vos besoins parmi nos catégories.</p>
          </div>
          <div class="col-md-4">
            <div class="bg-step text-primary">2</div>
            <h5 class="fw-semibold mb-3">Nous contactez</h5>
            <p class="text-muted">Prenez contact avec le prestataire et planifiez votre intervention.</p>
          </div>
          <div class="col-md-4">
            <div class="bg-step text-primary">3</div>
            <h5 class="fw-semibold mb-3">Évaluez</h5>
            <p class="text-muted">Notez votre expérience pour aider la communauté.</p>
          </div>
        </div>
      </div>
    </section>
  </default-layout>
</template>

<script>
  import api from '../services/api';
  import DefaultLayout from './Layout.vue';
  import { ref, onMounted } from 'vue';

  export default {
    name: 'HomePage',
    components: { DefaultLayout },
    computed: {
      user() {
        const auth_user = localStorage.getItem('auth_user_data');
        return auth_user ? JSON.parse(auth_user) : null;
      },
    },
    setup() {
      const categories = ref([]);
      const topPrestataire = ref([]);

      const formatImage = (imagePath) => {
        if (!imagePath) return '/img/default-avatar.png';
        if (imagePath.startsWith('http')) return imagePath;
        return `https://42492b2bb689.ngrok-free.app${imagePath}`;
      };

      onMounted(async () => {
        try {
          const [categoriesResponse, prestatairesResponse] = await Promise.all([
            api.get('prestation/detail_categorie/'),
            api.get('note/prestataires/top-notes/'),
          ]);
          categories.value = categoriesResponse.data;
          topPrestataire.value = prestatairesResponse.data;
        } catch (error) {
          console.error("Erreur lors du chargement des données utilisateur :", error);
        }
      });

      return { categories, topPrestataire, formatImage };
    },
    methods: {
      getIconClass(nom) {
        const icons = {
          'Électricité': 'fas fa-bolt',
          'Menuiserie': 'fas fa-hammer',
          'Maçonnerie': 'fas fa-person-digging',
          'Assistance virtuelle': 'fas fa-house-laptop',
          'Informatique & Réseaux': 'fas fa-network-wired',
        };
        return icons[nom] || 'fas fa-question-circle';
      },
    },
  };
</script>

<style scoped>
  /* Section spacing and background alternance */
  section {
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
  section:nth-child(odd) {
    background-color: #ffffff;
  }
  section:nth-child(even) {
    background-color: #f8f9fa;
  }

  /* Title styling */
  h2 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    text-align: center;
  }

  /* Cards */
  .card {
    transition: transform 0.2s ease-in-out;
  }
  .card:hover {
    transform: scale(1.02);
  }

  /* Icon style in categories */
  .card-body i {
    font-size: 2.5rem;
  }

  /* Prestataire image */
  .card-img-top {
    object-fit: cover;
    height: 180px;
  }

  /* Step icon style */
  .bg-step {
    background-color: #e9ecef;
    border-radius: 50%;
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.5rem;
    margin: 0 auto 1rem;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .card {
      margin-bottom: 1.5rem;
    }

    h1.display-4 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
</style>