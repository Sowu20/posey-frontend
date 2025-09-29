<template>
  <main class="container py-5">
    <!-- Profil prestataire -->
    <div v-if="prestataire" class="card p-4 shadow-sm">
      <div class="row align-items-center">
       <div class="col-md-4 text-center mb-4 mb-md-0">
          <img src="/img/default-avatar2.png" alt="Photo du prestataire" class="img-fluid rounded-circle border border-2 mb-3" style="max-width: 150px; height: 150px; object-fit: cover;"/>
          <h3 class="fw-bold mb-0">{{ prestataire.nom }} {{ prestataire.prenom }}</h3>
        </div>

        <div class="col-md-8">
          <p class="mb-2"><strong>Email :</strong> {{ prestataire.email }}</p>
          <p class="mb-2"><strong>Catégorie :</strong> {{ prestataire.categorie }}</p>
          <p class="mb-2"><strong>Quartier :</strong> {{ prestataire.quartier }}</p>
          <p class="mb-2"><strong>Ville :</strong> {{ prestataire.ville }}</p>

          <div class="mt-3">
            <strong>Note moyenne :</strong>
            <span class="text-warning fs-5">
              <span v-for="i in 5" :key="i">
                {{ i <= noteMoyenne ? '★' : '☆' }}
              </span>
            </span>
            <span class="ms-2 text-muted">({{ noteMoyenne ?? 'Non noté' }})</span>
          </div>

          <div class="mt-2 text-success">
            <strong>Prestations réalisées :</strong> {{ nombrePrestations }}
          </div>

          <!-- <div class="mt-auto">
            <button class="btn btn-primary w-100" @click="envoyerDemande">
              Envoyer une demande
            </button>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Chargement -->
    <div v-else class="text-center text-danger">Chargement du profil...</div>

    <!-- Services du prestataire -->
    <div v-if="services && services.length" class="mt-5">
      <h4 class="text-center mb-4">Services proposés</h4>
      <div class="row g-3">
        <div class="col-md-4" v-for="service in services" :key="service.id">
          <div class="card h-100 p-3 shadow-sm">
            <img v-if="service.image" :src="formatImage(service.image)" class="card-img-top" alt="Image service" style="height: 200px; object-fit: cover;" >
            <img v-else src="/img/default-service.png" class="card-img-top" alt="Image par défaut" style="height: 200px; object-fit: cover;">
            <h5 class="fw-bold">{{ service.nom }}</h5>
            <p class="text-muted">{{ service.description }}</p>
            <p><strong>Prix :</strong>{{ service.prix }}</p>
            <button class="btn btn-primary w-100" @click="commanderService(service)">Commander ce service</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center mt-5 text-muted">Aucun service pour le moment</div>

    <!-- Commentaires clients -->
    <div v-if="commentaires && commentaires.length" class="mt-5">
      <h4 class="text-center mb-4">Commentaires reçus</h4>
      <div class="row g-3">
        <div class="col-md-6" v-for="commentaire in commentaires" :key="commentaire.id">
          <div class="card h-100 p-3 shadow-sm">
            <p class="mb-2"><strong>{{ commentaire.client_nom }}</strong></p>
            <p class="mb-1 text-muted">"{{ commentaire.commentaire }}"</p>
            <div class="text-warning">
              <span v-for="i in 5" :key="i">
                {{ i <= commentaire.score ? '★' : '☆' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="prestataire" class="text-center mt-5 text-muted">
      Aucun commentaire reçu pour le moment.
    </div>
  </main>
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
      const nombrePrestations = ref(0)
      const commentaires = ref([])
      const services = ref([])

      const formatImage = (imagePath) => {
        if (!imagePath) return '/img/default-service.png'
        if (imagePath.startsWith('http')) return imagePath
        return `http://127.0.0.1:8000/${imagePath}`
      }

      const commanderService = async (service) => {
        const result = await Swal.fire({
          title: `Voulez-vous commander : ${service.nom} ?`,
          text: `Prix : ${service.prix} FCFA`,
          icone: "question",
          showCancelButton: true,
          confirmButtonText: "Oui, commander",
          cancelButtonText: "Annuler",
        });

        if (result.isConfirmed) {
          try {
            const user = JSON.parse(localStorage.getItem("auth_user_data"));
            await api.post('commande/register_commande/', {
              prestataire: prestataireId,
              client: user.id,
              service: service.id
            })
            Swal.fire("Succès", "Votre commande a été enregistrée ✅", "success");
          } catch (error) {
            console.error(error)
            Swal.fire("Erreur", "Impossible de passer la commande ❌", "error");
          }
        }
      }

      onMounted(async () => {
        try {
          const [userResponse, noteResponse, prestationsResponse, commentairesResponse, servicesResponse] = await Promise.all([
            api.get(`/user/prestataires/${prestataireId}/`),
            api.get(`/note/prestataire-note/${prestataireId}/`),
            api.get(`/prestation/terminees/${prestataireId}/`),
            api.get(`/note/commentaires/${prestataireId}/`),
            api.get(`/service/prestataire/${prestataireId}/`)
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

      return { prestataire, noteMoyenne, nombrePrestations, commentaires, formatImage, commanderService }
    }
  }
</script>
