<template>
  <default-layout>
    <main class="container py-7">
      <h2 class="mb-4 fw-bold">Rechercher un prestataire</h2>

      <div class="card p-4 mb-4">
        <div class="row g-3">
          <!-- Filtres -->
          <div class="col-md-3">
            <label for="categorie">Catégorie</label>
            <select class="form-select" v-model="selectedCategorie">
              <option value="">Toutes les catégories</option>
              <option v-for="categorie in categories" :key="categorie.id" :value="categorie.nom">
                {{ categorie.nom }}
              </option>
            </select>
          </div>

          <div class="col-md-3">
            <label for="note">Notes</label>
            <select class="form-select" v-model="selectedNote">
              <option value="">Toutes les notes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles et +</option>
              <option value="3">3 étoiles et +</option>
              <option value="2">2 étoiles et +</option>
              <option value="1">1 étoile et +</option>
            </select>
          </div>

          <div class="col-md-3">
            <label for="quartier">Quartier</label>
            <input type="text" class="form-control" v-model="selectedQuartier" />
          </div>

          <div class="col-md-3">
            <label for="ville">Ville</label>
            <input type="text" class="form-control" v-model="selectedVille" />
          </div>

          <!-- Bouton réinitialisation -->
          <div class="col-12 d-flex justify-content-end">
            <button class="btn btn-primary mt-2" @click="resetFiltres">
              Réinitialiser les filtres
            </button>
          </div>

          <!-- Liste des prestataires -->
          <div class="row g-4 mt-2" v-if="paginatedPrestataires.length">
            <div class="col-12" v-for="prestataire in paginatedPrestataires" :key="prestataire.id">
              <div class="card h-100 shadow-sm">
                <div class="row g-0">
                  <div class="col-md-3">
                    <div class="d-flex justify-content-center align-items-center" style="height: 100px; width: 100px; margin: auto;">
                      <img src="/img/default-avatar2.png" class="rounded-circle" style="height: 70px; width: 70px; object-fit: cover;" />
                    </div>
                  </div>
                  <div class="col-md-9 p-3">
                    <div class="d-flex justify-content-between">
                      <div>
                        <h5 class="mb-1">{{ prestataire.nom }} {{ prestataire.prenom }}</h5>
                        <p class="text-primary mb-1">{{ prestataire.categorie }}</p>
                        <p class="text-muted">{{ prestataire.quartier }}</p>
                        <p class="text-muted">{{ prestataire.ville }}</p>
                      </div>
                      <div class="text-end text-warning" style="cursor: pointer;">
                        <span v-for="i in 5" :key="i" class="fs-5">
                          {{ i <= getNote(prestataire.id) ? '★' : '☆' }}
                        </span>
                        <span class="ms-2 text-muted">
                          ({{ getNote(prestataire.id) ?? 'Non noté' }})
                        </span>
                      </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <router-link class="btn btn-outline-primary btn-sm me-2" :to="`/prestataire/${prestataire.id}`">Voir profil</router-link>
                        <button class="btn btn-primary btn-sm">Contacter</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Aucun résultat -->
          <div v-else-if="filtrageActif && filteredPrestataires.length === 0" class="mt-4 text-center text-danger fw-bold">
            Aucun prestataire trouvé.
          </div>

          <!-- Pagination -->
          <div class="mt-5 w-100 d-flex justify-content-center" v-if="totalPages > 1">
            <nav class="d-flex gap-2 align-items-center">
              <button class="btn btn-outline-primary" :disabled="currentPage === 1" @click="currentPage--">
                &lt;
              </button>

              <button
                v-for="page in totalPages" :key="page" @click="() => currentPage = page" :class="[ 'btn', currentPage === page ? 'btn-primary text-white' : 'btn-outline-primary' ]">
                {{ page }}
              </button>

              <button class="btn btn-outline-primary" :disabled="currentPage === totalPages" @click="currentPage++">
                &gt;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </main>
  </default-layout>
</template>

<script>
  import DefaultLayout from './Layout.vue'
  import api from '../services/api'
  import { ref, onMounted, computed, watch } from 'vue'

  export default {
    name: 'RecherchePrestatairePage',
    components: {
      DefaultLayout
    },
    setup() {
      const categories = ref([])
      const prestataire = ref([])
      const note = ref([])
      const filteredPrestataires = ref([])
      const filtrageActif = computed(() =>
        selectedCategorie.value || selectedNote.value || selectedQuartier.value || selectedVille.value
      )

      const selectedCategorie = ref('')
      const selectedNote = ref('')
      const selectedQuartier = ref('')
      const selectedVille = ref('')

      const currentPage = ref(1)
      const itemsPerPage = 3

      const getNote = (prestataireId) => {
        const found = note.value.find(n => n.prestataire__id === prestataireId)
        return found ? Math.round(found.moyenne_score) : null
      }

      const filtrerPrestataires = () => {
        let resultat = [...prestataire.value]

        if (selectedCategorie.value) {
          resultat = resultat.filter(p => p.categorie === selectedCategorie.value)
        }

        if (selectedNote.value) {
          resultat = resultat.filter(p => {
            const n = getNote(p.id)
            return n && n >= parseInt(selectedNote.value)
          })
        }

        if (selectedQuartier.value) {
          resultat = resultat.filter(p => p.quartier.toLowerCase().includes(selectedQuartier.value.toLowerCase()))
        }

        if (selectedVille.value) {
          resultat = resultat.filter(p => p.ville.toLowerCase().includes(selectedVille.value.toLowerCase()))
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

      const paginatedPrestataires = computed(() => {
        const list = filtrageActif.value ? filteredPrestataires.value : prestataire.value
        const start = (currentPage.value - 1) * itemsPerPage
        return list.slice(start, start + itemsPerPage)
      })

      const totalPages = computed(() => {
        const list = filtrageActif.value ? filteredPrestataires.value : prestataire.value
        return Math.ceil(list.length / itemsPerPage)
      })

      onMounted(async () => {
        try {
          const [categoriesResponse, prestatairesResponse, notesResponse] = await Promise.all([
            api.get('prestation/detail_categorie/'),
            api.get('user/prestataires/'),
            api.get('/note/prestataire-scores/')
          ])
          categories.value = categoriesResponse.data
          prestataire.value = prestatairesResponse.data
          note.value = notesResponse.data
          filtrerPrestataires()
        } catch (error) {
          console.error('Erreur lors du chargement des données:', error)
        }
      })

      watch([selectedCategorie, selectedNote, selectedQuartier, selectedVille], filtrerPrestataires)

      return { categories, prestataire, note, selectedCategorie, selectedNote, selectedQuartier, selectedVille, getNote, currentPage, totalPages, paginatedPrestataires, resetFiltres }
    }
  }
</script>

<style scoped>
  .hover-shadow:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
  }
</style>