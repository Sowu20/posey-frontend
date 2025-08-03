<template>
  <div>
    <h5 class="mb-3 fw-bold">Demande de prestation</h5>
    <div class="input-group mb-3">
      <select v-model="categorie" class="form-select">
        <option disabled value="">Choisir une catégorie</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.nom }}
        </option>
      </select>
      <button class="btn btn-outline-secondary" @click="rechercherPrestataires">🔍</button>
    </div>

    <!-- Filtres -->
    <div class="row g-3 mb-3 align-items-end" v-if="prestatairesBruts.length">
      <div class="col-md-3">
        <label>Quartier</label>
        <input type="text" class="form-control" v-model="selectedQuartier" />
      </div>
      <div class="col-md-3">
        <label>Ville</label>
        <input type="text" class="form-control" v-model="selectedVille" />
      </div>
      <div class="col-md-2 d-flex gap-2">
        <button class="btn btn-outline-secondary w-100" @click="appliquerFiltres" :disabled="!filtrageActif">🔍</button>
        <button class="btn btn-outline-danger w-100" @click="resetFiltres">↺</button>
      </div>
    </div>

    <!-- Liste prestataires -->
    <div v-if="prestatairesFiltres.length">
      <div class="row g-4 mt-2">
        <div class="col-12" v-for="p in prestatairesFiltres" :key="p.id">
          <div class="card h-100 shadow-sm">
            <div class="row g-0">
              <div class="col-md-3">
                <img src="/img/default-avatar.png" class="card-img-top" style="height: 110px; object-fit: contain" />
              </div>
              <div class="col-md-9 p-3">
                <div class="d-flex justify-content-between">
                  <div>
                    <h5 class="mb-1">{{ p.prenom }} {{ p.nom }}</h5>
                    <p class="text-primary mb-1">{{ p.categorie_nom }}</p>
                    <p class="text-muted mb-1">{{ p.quartier }} — {{ p.ville }}</p>
                  </div>
                  <div class="text-warning text-end">
                    <span class="text-warning fs-5">
                      <span v-for="i in 5" :key="i">
                        {{ i <= (p.note_moyenne || 0) ? '★' : '☆' }}
                      </span>
                    </span>
                    <span class="ms-2 text-muted">
                      ({{ p.note_moyenne ? p.note_moyenne.toFixed(1) : 'Non noté' }})
                    </span>
                  </div>
                </div>
                <div class="d-flex justify-content-between mt-3">
                  <router-link class="btn btn-outline-primary btn-sm me-2" :to="`/prestataire/${p.id}`">Voir profil</router-link>
                  <button class="btn btn-sm btn-primary" @click="ouvrirDialog(p)">💬 Discuter</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Aucun résultat -->
    <div v-if="rechercheEffectuee && !prestatairesFiltres.length" class="mt-4 text-center text-danger fw-bold">
      Aucun prestataire trouvé.
    </div>

    <!-- Modal -->
    <div v-if="showDialog">
      <div class="modal-backdrop fade show"></div>
      <div class="modal d-block">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ prestataireSelectionne.prenom }} {{ prestataireSelectionne.nom }}</h5>
              <button type="button" class="btn-close" @click="fermerDialog"></button>
            </div>
            <div class="modal-body">
              <textarea v-model="description" rows="5" class="form-control" placeholder="Décrivez la prestation ici..."></textarea>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="fermerDialog">Annuler</button>
              <button class="btn btn-success" @click="envoyerDemande">Envoyer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../services/api'
  import Swal from 'sweetalert2'

  export default {
    name: 'CleintPrestation',
    props: ['categories'],
    setup () {
      const formatImage = (imagePath) => {
        if (!imagePath) return '/img/default-avatar.png'
        if (imagePath.startsWith('http')) return imagePath
        return `http://127.0.0.1:8000${imagePath}`
      }

      return { formatImage }
    },
    data() {
      return {
        categorie: '',
        showDialog: false,
        selectedQuartier: '',
        selectedVille: '',
        description: '',
        prestataireSelectionne: {},
        prestatairesBruts: [],
        prestatairesFiltres: [],
        rechercheEffectuee: false,
      }
    },
    computed: {
      filtrageActif() {
        return this.selectedQuartier || this.selectedVille
      }
    },
    methods: {
      ouvrirDialog(prestataire) {
        this.prestataireSelectionne = prestataire
        this.showDialog = true
      },
      fermerDialog() {
        this.showDialog = false
        this.description = ''
      },
      async rechercherPrestataires() {
        if (!this.categorie) {
          Swal.fire({
            icon: 'warning',
            title: 'Attention',
            text: 'Veuillez sélectionner une catégorie',
          })
          return
        }

        const loader = this.$loading.show()

        try {
          const response = await api.get(`/user/categorie/?categorie=${this.categorie}`)
          const categorieSelectionnee = this.categories.find(cat => cat.id === this.categorie)
          const nomCategorie = categorieSelectionnee ? categorieSelectionnee.nom : 'Catégorie inconnue'

          const prestatairesBruts = await Promise.all(
            response.data.map(async (prestataire) => {
              try {
                const noteResponse = await api.get(`/note/prestataire-note/${prestataire.id}/`)
                return {
                  ...prestataire,
                  categorie_nom: nomCategorie,
                  note_moyenne: noteResponse.data.moyenne_score
                }
              } catch (error) {
                console.error(`Erreur récupération note prestataire ${prestataire.id}:`, error)
                return {
                  ...prestataire,
                  categorie_nom: nomCategorie,
                  note_moyenne: 0
                }
              }
            })
          )

          this.prestatairesBruts = prestatairesBruts
          this.prestatairesFiltres = [...prestatairesBruts]
          this.resetFiltresChamps()
          this.rechercheEffectuee = true
        } catch (error) {
          console.error('Erreur lors de la recherche:', error)
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'La recherche des prestataires a échoué.',
          })
        } finally {
          loader.hide()
        }
      },
      appliquerFiltres() {
        this.prestatairesFiltres = this.prestatairesBruts.filter(prestataire => {
          const correspondQuartier = !this.selectedQuartier || prestataire.quartier?.toLowerCase().includes(this.selectedQuartier.toLowerCase())
          const correspondVille = !this.selectedVille || prestataire.ville?.toLowerCase().includes(this.selectedVille.toLowerCase())
          return correspondQuartier && correspondVille
        })
      },
      resetFiltres() {
        this.resetFiltresChamps()
        this.prestatairesFiltres = [...this.prestatairesBruts]
      },
      resetFiltresChamps() {
        this.selectedQuartier = ''
        this.selectedVille = ''
      },
      async envoyerDemande() {
        try {
          const userData = JSON.parse(localStorage.getItem('auth_user_data'))
          if (!userData || !userData.id) throw new Error('Utilisateur non connecté')

          if (!this.description || !this.categorie) {
            Swal.fire({
              icon: 'warning',
              title: 'Champs manquants',
              text: 'Veuillez remplir tous les champs obligatoires.',
            })
            return
          }

          const titre = `Demande de ${this.categories.find(cat => cat.id === this.categorie)?.nom || ''}`

          const payload = {
            client: parseInt(userData.id),
            prestataire: parseInt(this.prestataireSelectionne.id),
            categorie: parseInt(this.categorie),
            titre: titre,
            description: this.description
          }

          await api.post('/prestation/demandes/', payload)

          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Demande envoyée avec succès.',
            timer: 2000,
            showConfirmButton: false
          })

          this.fermerDialog()
        } catch (error) {
          console.error('Erreur envoi demande:', error.response?.data || error)
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: "Une erreur est survenue lors de l'envoi de la demande.",
          })
        }
      }
    }
  }
</script>