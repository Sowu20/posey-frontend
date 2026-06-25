<template>
  <div class="provider-page pb-5">
    <!-- Vue détail service / devis -->
    <div v-if="selectedService" class="container py-4">
      <button class="posey-btn-outline btn-sm mb-4" @click="selectedService = null">
        <i class="fas fa-arrow-left me-2"></i>Retour au profil
      </button>

      <nav class="small posey-text-muted mb-3">
        <router-link to="/" class="footer-link">Accueil</router-link>
        <span class="mx-2">›</span>
        <span>{{ prestataire?.categorie }}</span>
        <span class="mx-2">›</span>
        <span>{{ selectedService.nom }}</span>
      </nav>

      <div class="row g-4">
        <div class="col-lg-8">
          <h2 class="fw-bold mb-3">{{ selectedService.nom }}</h2>
          <div class="posey-card overflow-hidden mb-4">
            <img
              :src="selectedService.image ? formatImage(selectedService.image) : '/img/default-service.png'"
              class="w-100"
              style="height: 320px; object-fit: cover;"
              alt="Service"
            />
          </div>

          <div class="posey-card p-4 mb-4">
            <h5 class="fw-bold mb-3">À propos de ce service</h5>
            <p class="posey-text-muted">{{ selectedService.description || 'Aucune description disponible.' }}</p>
          </div>

          <div class="posey-card p-4">
            <h5 class="fw-bold mb-3">À propos du prestataire</h5>
            <div class="d-flex align-items-center gap-3">
              <img src="/img/default-avatar2.png" class="rounded-circle" width="56" height="56" alt="" />
              <div>
                <strong>{{ prestataire?.nom }} {{ prestataire?.prenom }}</strong>
                <p class="posey-text-muted small mb-0">{{ prestataire?.categorie }} · {{ prestataire?.ville }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="posey-card p-4 sticky-top" style="top: 80px;">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h5 class="fw-bold mb-0">Demander un devis</h5>
              <span class="fw-bold posey-text-primary">{{ selectedService.prix }} FCFA</span>
            </div>
            <p class="posey-text-muted small mb-3">Décrivez votre projet pour recevoir une proposition.</p>
            <textarea
              v-model="devisMessage"
              class="posey-input w-100 mb-3"
              rows="4"
              placeholder="Décrivez votre projet..."
            ></textarea>
            <button class="posey-btn-primary w-100 mb-2" :disabled="loading" @click="commanderService(selectedService)">
              {{ loading ? 'Envoi...' : 'Demander un devis' }}
            </button>
            <button class="posey-btn-outline w-100" @click="commanderService(selectedService)">
              Commander directement
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue profil prestataire -->
    <template v-else>
      <div v-if="prestataire" class="container py-4">
        <!-- En-tête profil -->
        <div class="posey-card p-4 mb-4">
          <div class="row align-items-center g-4">
            <div class="col-md-auto text-center">
              <img src="/img/default-avatar2.png" class="rounded-circle profile-avatar" alt="" />
            </div>
            <div class="col-md">
              <h2 class="fw-bold mb-1">{{ prestataire.nom }} {{ prestataire.prenom }}</h2>
              <p class="posey-text-primary mb-2">{{ prestataire.categorie }}</p>
              <p class="posey-text-muted small mb-2">
                <i class="fas fa-map-marker-alt me-1"></i>{{ prestataire.quartier }}, {{ prestataire.ville }}
              </p>
              <div class="d-flex flex-wrap gap-2 mb-2">
                <span class="posey-badge posey-badge-success"><i class="fas fa-check me-1"></i>Prestataire vérifié</span>
                <span v-if="noteMoyenne >= 4" class="posey-badge posey-badge-warning"><i class="fas fa-trophy me-1"></i>Top prestataire</span>
              </div>
              <div class="posey-stars">
                <span v-for="i in 5" :key="i">{{ i <= noteMoyenne ? '★' : '☆' }}</span>
                <span class="posey-text-muted ms-2">({{ noteMoyenne ?? 'Non noté' }})</span>
              </div>
            </div>
            <div class="col-md-auto d-flex flex-column gap-2">
              <button class="posey-btn-outline" @click="activeTab = 'services'">Voir les services</button>
              <button
                v-if="services.length"
                class="posey-btn-primary"
                @click="selectService(services[0])"
              >
                Demander un devis
              </button>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <!-- Sidebar infos -->
          <aside class="col-lg-4">
            <div class="posey-card p-4 mb-4">
              <h6 class="fw-bold mb-3">Informations clés</h6>
              <div class="mb-3">
                <small class="posey-text-muted d-block">Email</small>
                <span>{{ prestataire.email }}</span>
              </div>
              <div class="mb-3">
                <small class="posey-text-muted d-block">Catégorie</small>
                <span class="posey-badge posey-badge-info">{{ prestataire.categorie }}</span>
              </div>
              <div>
                <small class="posey-text-muted d-block">Localisation</small>
                <span>{{ prestataire.quartier }}, {{ prestataire.ville }}</span>
              </div>
            </div>

            <div class="posey-card p-4">
              <h6 class="fw-bold mb-3">Statistiques</h6>
              <div class="row g-3 text-center">
                <div class="col-6">
                  <div class="stat-mini">
                    <div class="stat-mini-value">{{ nombrePrestations }}</div>
                    <div class="stat-mini-label">Projets terminés</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="stat-mini">
                    <div class="stat-mini-value">{{ noteMoyenne ?? '—' }}</div>
                    <div class="stat-mini-label">Note moyenne</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="stat-mini">
                    <div class="stat-mini-value">{{ commentaires.length }}</div>
                    <div class="stat-mini-label">Avis reçus</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="stat-mini">
                    <div class="stat-mini-value">{{ services.length }}</div>
                    <div class="stat-mini-label">Services</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <!-- Contenu onglets -->
          <main class="col-lg-8">
            <div class="tabs-bar mb-4">
              <button class="tab-btn" :class="{ active: activeTab === 'about' }" @click="activeTab = 'about'">À propos</button>
              <button class="tab-btn" :class="{ active: activeTab === 'services' }" @click="activeTab = 'services'">Services</button>
              <button class="tab-btn" :class="{ active: activeTab === 'reviews' }" @click="activeTab = 'reviews'">
                Avis ({{ commentaires.length }})
              </button>
            </div>

            <!-- À propos -->
            <div v-if="activeTab === 'about'" class="posey-card p-4">
              <h5 class="fw-bold mb-3">Biographie</h5>
              <p class="posey-text-muted">
                {{ prestataire.nom }} {{ prestataire.prenom }} est un(e) professionnel(le) spécialisé(e) en
                {{ prestataire.categorie }}, basé(e) à {{ prestataire.ville }}.
                Avec {{ nombrePrestations }} prestation(s) réalisée(s) sur POSEY, ce prestataire s'engage à
                fournir un service de qualité.
              </p>
            </div>

            <!-- Services -->
            <div v-if="activeTab === 'services'">
              <div v-if="services.length" class="row g-3">
                <div class="col-md-6" v-for="service in services" :key="service.id">
                  <div class="posey-card h-100 overflow-hidden service-card">
                    <img
                      :src="service.image ? formatImage(service.image) : '/img/default-service.png'"
                      class="service-img"
                      alt=""
                    />
                    <div class="p-3">
                      <h6 class="fw-bold">{{ service.nom }}</h6>
                      <p class="posey-text-muted small mb-2">{{ service.description?.slice(0, 80) }}...</p>
                      <div class="d-flex justify-content-between align-items-center">
                        <strong class="posey-text-primary">{{ service.prix }} FCFA</strong>
                        <button class="posey-btn-primary btn-sm" @click="selectService(service)">Voir détails</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="posey-card p-5 text-center posey-text-muted">Aucun service pour le moment.</div>
            </div>

            <!-- Avis -->
            <div v-if="activeTab === 'reviews'">
              <div v-if="commentaires.length" class="d-flex flex-column gap-3">
                <div v-for="commentaire in commentaires" :key="commentaire.id" class="posey-card p-4">
                  <div class="d-flex justify-content-between mb-2">
                    <strong>{{ commentaire.client_nom }}</strong>
                    <div class="posey-stars small">
                      <span v-for="i in 5" :key="i">{{ i <= commentaire.score ? '★' : '☆' }}</span>
                    </div>
                  </div>
                  <p class="posey-text-muted mb-0">"{{ commentaire.commentaire }}"</p>
                </div>
              </div>
              <div v-else class="posey-card p-5 text-center posey-text-muted">Aucun avis pour le moment.</div>
            </div>
          </main>
        </div>
      </div>

      <div v-else class="container py-5 text-center posey-text-muted">
        <i class="fas fa-spinner fa-spin fs-2 mb-3"></i>
        <p>Chargement du profil...</p>
      </div>
    </template>
  </div>
</template>

<script>
import api from '../services/api'
import Swal from 'sweetalert2'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'ShowProviderTemplate',
  setup() {
    const route = useRoute()
    const prestataireId = route.params.id

    const prestataire = ref(null)
    const noteMoyenne = ref(null)
    const loading = ref(false)
    const nombrePrestations = ref(0)
    const commentaires = ref([])
    const services = ref([])
    const activeTab = ref('about')
    const selectedService = ref(null)
    const devisMessage = ref('')

    const formatImage = (imagePath) => {
      if (!imagePath) return '/img/default-service.png'
      if (imagePath.startsWith('http')) return imagePath
      return `http://127.0.0.1:8000/${imagePath}`
    }

    const selectService = (service) => {
      selectedService.value = service
      devisMessage.value = ''
    }

    const commanderService = async (service) => {
      const user = JSON.parse(localStorage.getItem('auth_user_data'))
      if (!user?.id || !user?.access) {
        Swal.fire('Connexion requise', 'Veuillez vous connecter pour commander.', 'warning')
        return
      }
      loading.value = true
      try {
        const response = await api.post(
          'commande/creer_commande/',
          { service_id: service.id },
          { headers: { Authorization: `Bearer ${user.access}` } }
        )
        Swal.fire('Succès', response.data.message, 'success')
        selectedService.value = null
      } catch (error) {
        const msg = error.response?.data?.error || 'Une erreur est survenue.'
        Swal.fire('Erreur', msg, 'error')
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      try {
        const [userResponse, noteResponse, prestationsResponse, commentairesResponse, servicesResponse] =
          await Promise.all([
            api.get(`/user/prestataires/${prestataireId}/`),
            api.get(`/note/prestataire-note/${prestataireId}/`),
            api.get(`/prestation/terminees/${prestataireId}/`),
            api.get(`/note/commentaires/${prestataireId}/`),
            api.get(`/service/list_service/${prestataireId}/`),
          ])
        prestataire.value = userResponse.data
        noteMoyenne.value = Math.round(noteResponse.data.moyenne_score || 0)
        nombrePrestations.value = prestationsResponse.data.total || 0
        commentaires.value = commentairesResponse.data || []
        services.value = servicesResponse.data || []
      } catch (error) {
        console.error('Erreur de chargement du profil', error)
      }
    })

    return {
      prestataire, noteMoyenne, nombrePrestations, commentaires, services,
      loading, formatImage, commanderService, activeTab, selectedService,
      selectService, devisMessage,
    }
  },
}
</script>

<style scoped>
.provider-page {
  background: var(--posey-bg);
  min-height: 60vh;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 3px solid var(--posey-primary);
}

.stat-mini-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-mini-label {
  font-size: 0.75rem;
  color: var(--posey-text-muted);
}

.tabs-bar {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--posey-border);
}

.tab-btn {
  background: none;
  border: none;
  color: var(--posey-text-muted);
  padding: 0.75rem 1.25rem;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s;
}

.tab-btn.active {
  color: var(--posey-primary);
  border-bottom-color: var(--posey-primary);
}

.service-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.service-card {
  transition: border-color 0.2s;
}

.service-card:hover {
  border-color: var(--posey-primary);
}

.footer-link {
  color: var(--posey-text-muted);
  text-decoration: none;
}

.footer-link:hover {
  color: var(--posey-primary);
}
</style>
