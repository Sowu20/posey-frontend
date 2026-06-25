<template>
  <default-layout>
    <!-- Hero recherche -->
    <section class="search-hero py-5">
      <div class="container">
        <h1 class="fw-bold mb-2">Trouvez le prestataire idéal pour vos besoins</h1>
        <p class="posey-text-muted mb-4">Recherchez par service, mot-clé et localisation.</p>
        <div class="search-bar posey-card p-2">
          <div class="row g-2">
            <div class="col-md-5">
              <div class="d-flex align-items-center gap-2 px-2">
                <i class="fas fa-search posey-text-muted"></i>
                <input
                  v-model="selectedCategorie"
                  type="text"
                  class="posey-input border-0 flex-grow-1"
                  placeholder="Service, mot-clé..."
                  list="categories-list"
                />
                <datalist id="categories-list">
                  <option v-for="c in categories" :key="c.id" :value="c.nom" />
                </datalist>
              </div>
            </div>
            <div class="col-md-5">
              <div class="d-flex align-items-center gap-2 px-2">
                <i class="fas fa-map-marker-alt posey-text-muted"></i>
                <input
                  v-model="selectedVille"
                  type="text"
                  class="posey-input border-0 flex-grow-1"
                  placeholder="Ville..."
                />
              </div>
            </div>
            <div class="col-md-2">
              <button class="posey-btn-primary w-100 h-100" @click="filtrerPrestataires">Rechercher</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container pb-5">
      <div class="row g-4">
        <!-- Filtres sidebar -->
        <aside class="col-lg-3">
          <div class="posey-card p-4 sticky-top" style="top: 80px;">
            <h5 class="fw-bold mb-1">Filtres</h5>
            <p class="posey-text-muted small mb-4">Affinez votre recherche</p>

            <label class="small fw-semibold mb-2 d-block">Catégorie</label>
            <select v-model="selectedCategorie" class="posey-input w-100 mb-3" @change="filtrerPrestataires">
              <option value="">Toutes les catégories</option>
              <option v-for="categorie in categories" :key="categorie.id" :value="categorie.nom">
                {{ categorie.nom }}
              </option>
            </select>

            <label class="small fw-semibold mb-2 d-block">Note minimale</label>
            <select v-model="selectedNote" class="posey-input w-100 mb-3" @change="filtrerPrestataires">
              <option value="">Toutes les notes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles et +</option>
              <option value="3">3 étoiles et +</option>
            </select>

            <label class="small fw-semibold mb-2 d-block">Quartier</label>
            <input
              v-model="selectedQuartier"
              type="text"
              class="posey-input w-100 mb-4"
              placeholder="Quartier..."
              @input="filtrerPrestataires"
            />

            <button class="posey-btn-primary w-100 mb-2" @click="filtrerPrestataires">Appliquer</button>
            <button class="posey-btn-outline w-100" @click="resetFiltres">Réinitialiser</button>
          </div>
        </aside>

        <!-- Résultats -->
        <main class="col-lg-9">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="mb-0 fw-bold">
              {{ displayList.length }} prestataire{{ displayList.length > 1 ? 's' : '' }} trouvé{{ displayList.length > 1 ? 's' : '' }}
            </h5>
          </div>

          <div v-if="paginatedPrestataires.length" class="row g-4">
            <div class="col-md-6 col-xl-4" v-for="p in paginatedPrestataires" :key="p.id">
              <div class="posey-card h-100 overflow-hidden result-card">
                <img src="/img/default-avatar2.png" class="result-img" :alt="p.nom" />
                <div class="p-3">
                  <h6 class="fw-bold mb-1">{{ p.nom }} {{ p.prenom }}</h6>
                  <p class="posey-text-primary small mb-1">{{ p.categorie }}</p>
                  <p class="posey-text-muted small mb-2">
                    <i class="fas fa-map-marker-alt me-1"></i>{{ p.quartier }}, {{ p.ville }}
                  </p>
                  <div class="posey-stars small mb-3">
                    <span v-for="i in 5" :key="i">{{ i <= (getNote(p.id) || 0) ? '★' : '☆' }}</span>
                    <span class="posey-text-muted ms-1">({{ getNote(p.id) ?? 'N/A' }})</span>
                  </div>
                  <router-link :to="`/prestataire/${p.id}`" class="posey-btn-primary w-100 text-center text-decoration-none d-block">
                    Voir le profil
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="posey-card p-5 text-center">
            <i class="fas fa-search fs-1 posey-text-muted mb-3"></i>
            <p class="posey-text-muted mb-0">Aucun prestataire trouvé avec ces critères.</p>
          </div>

          <nav v-if="totalPages > 1" class="d-flex justify-content-center gap-2 mt-4">
            <button class="posey-btn-outline btn-sm" :disabled="currentPage === 1" @click="currentPage--">&lt;</button>
            <button
              v-for="page in totalPages"
              :key="page"
              class="btn btn-sm"
              :class="currentPage === page ? 'posey-btn-primary' : 'posey-btn-outline'"
              @click="currentPage = page"
            >{{ page }}</button>
            <button class="posey-btn-outline btn-sm" :disabled="currentPage === totalPages" @click="currentPage++">&gt;</button>
          </nav>
        </main>
      </div>
    </div>
  </default-layout>
</template>

<script>
import DefaultLayout from './Layout.vue'
import api from '../services/api'
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'RecherchePrestatairePage',
  components: { DefaultLayout },
  setup() {
    const route = useRoute()
    const categories = ref([])
    const prestataire = ref([])
    const note = ref([])
    const filteredPrestataires = ref([])

    const selectedCategorie = ref('')
    const selectedNote = ref('')
    const selectedQuartier = ref('')
    const selectedVille = ref('')
    const currentPage = ref(1)
    const itemsPerPage = 6

    const filtrageActif = computed(() =>
      selectedCategorie.value || selectedNote.value || selectedQuartier.value || selectedVille.value
    )

    const getNote = (prestataireId) => {
      const found = note.value.find(n => n.prestataire__id === prestataireId)
      return found ? Math.round(found.moyenne_score) : null
    }

    const filtrerPrestataires = () => {
      let resultat = [...prestataire.value]
      if (selectedCategorie.value) {
        resultat = resultat.filter(p =>
          p.categorie?.toLowerCase().includes(selectedCategorie.value.toLowerCase())
        )
      }
      if (selectedNote.value) {
        resultat = resultat.filter(p => {
          const n = getNote(p.id)
          return n && n >= parseInt(selectedNote.value)
        })
      }
      if (selectedQuartier.value) {
        resultat = resultat.filter(p =>
          p.quartier?.toLowerCase().includes(selectedQuartier.value.toLowerCase())
        )
      }
      if (selectedVille.value) {
        resultat = resultat.filter(p =>
          p.ville?.toLowerCase().includes(selectedVille.value.toLowerCase())
        )
      }
      filteredPrestataires.value = resultat
      currentPage.value = 1
    }

    const resetFiltres = () => {
      selectedCategorie.value = ''
      selectedNote.value = ''
      selectedQuartier.value = ''
      selectedVille.value = ''
      filteredPrestataires.value = []
      currentPage.value = 1
    }

    const displayList = computed(() =>
      filtrageActif.value ? filteredPrestataires.value : prestataire.value
    )

    const paginatedPrestataires = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      return displayList.value.slice(start, start + itemsPerPage)
    })

    const totalPages = computed(() =>
      Math.ceil(displayList.value.length / itemsPerPage)
    )

    onMounted(async () => {
      if (route.query.q) selectedCategorie.value = route.query.q
      try {
        const [categoriesResponse, prestatairesResponse, notesResponse] = await Promise.all([
          api.get('prestation/detail_categorie/'),
          api.get('user/prestataires/'),
          api.get('/note/prestataire-scores/'),
        ])
        categories.value = categoriesResponse.data
        prestataire.value = prestatairesResponse.data
        note.value = notesResponse.data
        if (route.query.q) filtrerPrestataires()
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      }
    })

    watch([selectedCategorie, selectedNote, selectedQuartier, selectedVille], filtrerPrestataires)

    return {
      categories, note, selectedCategorie, selectedNote, selectedQuartier, selectedVille,
      getNote, currentPage, totalPages, paginatedPrestataires, resetFiltres,
      filtrerPrestataires, displayList,
    }
  },
}
</script>

<style scoped>
.search-hero {
  background: var(--posey-bg-card);
  border-bottom: 1px solid var(--posey-border);
}

.result-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.result-card {
  transition: transform 0.2s, border-color 0.2s;
}

.result-card:hover {
  transform: translateY(-4px);
  border-color: var(--posey-primary);
}
</style>
