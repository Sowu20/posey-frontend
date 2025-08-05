<template>
  <div class="container-fluid px-4 py-3">
    <!-- Bouton ajouter -->
    <div class="mb-3 text-end">
      <button class="btn btn-primary" @click="ouvrirModalAjout">Ajouter une catégorie</button>
    </div>

    <!-- Tableau -->
    <div class="table-responsive shadow-sm rounded">
      <table class="table table-bordered table-striped text-center">
        <thead class="table-light">
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in categories" :key="cat.id">
            <td>{{ cat.nom }}</td>
            <td>{{ cat.description }}</td>
            <td>
              <div class="d-flex justify-content-center gap-2">
                <button class="btn btn-warning btn-sm" @click="ouvrirModalEdition(cat)">Modifier</button>
                <button class="btn btn-danger btn-sm" @click="confirmerSuppression(cat)">Supprimer</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Ajout / Edition -->
    <div class="modal fade" id="categorieModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ mode === 'ajout' ? 'Ajouter' : 'Modifier' }} une catégorie</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="soumettreCategorie">
              <div class="mb-3">
                <label>Nom</label>
                <input v-model="form.nom" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label>Description</label>
                <textarea v-model="form.description" class="form-control" rows="3"></textarea>
              </div>
              <div class="text-end">
                <button class="btn btn-primary" type="submit">
                  {{ mode === 'ajout' ? 'Ajouter' : 'Modifier' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../services/api'
  import Swal from 'sweetalert2'
  import * as bootstrap from 'bootstrap'

  export default {
    name: 'GestionCategoriePrestation',
    data() {
      return {
        categories: [],
        form: {
          nom: '',
          description: ''
        },
        mode: 'ajout',
        editId: null,
        modalInstance: null
      }
    },
    methods: {
      async chargerCategories() {
        try {
          const res = await api.get('/detail_categorie/')
          this.categories = res.data
        } catch (err) {
          console.error('Erreur chargement des catégories', err)
        }
      },
      ouvrirModalAjout() {
        this.mode = 'ajout'
        this.form.nom = ''
        this.form.description = ''
        this.editId = null
        this.modalInstance = new bootstrap.Modal(document.getElementById('categorieModal'))
        this.modalInstance.show()
      },
      ouvrirModalEdition(cat) {
        this.mode = 'modification'
        this.form.nom = cat.nom
        this.form.description = cat.description
        this.editId = cat.id
        this.modalInstance = new bootstrap.Modal(document.getElementById('categorieModal'))
        this.modalInstance.show()
      },
      async soumettreCategorie() {
        try {
          if (this.mode === 'ajout') {
            await api.post('/register_categorie/', this.form)
            Swal.fire('Succès', 'Catégorie ajoutée.', 'success')
          } else {
            await api.put(`/update_categorie/${this.editId}/`, this.form)
            Swal.fire('Succès', 'Catégorie modifiée.', 'success')
          }
          this.modalInstance.hide()
          this.chargerCategories()
        } catch (err) {
          console.error(err)
          Swal.fire('Erreur', "Échec de l'opération.", 'error')
        }
      },
      confirmerSuppression(cat) {
        Swal.fire({
          title: 'Supprimer cette catégorie ?',
          text: `Nom : ${cat.nom}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, supprimer',
          cancelButtonText: 'Annuler',
          confirmButtonColor: '#d33'
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await api.delete(`/delete_categorie/${cat.id}/`)
              this.chargerCategories()
              Swal.fire('Supprimée', 'Catégorie supprimée avec succès.', 'success')
            } catch (err) {
              console.error(err)
              Swal.fire('Erreur', "Impossible de supprimer cette catégorie.", 'error')
            }
          }
        })
      }
    },
    mounted() {
      this.chargerCategories()
    }
  }
</script>

<style scoped>
  h2 {
    font-size: 1.5rem;
    font-weight: bold;
  }
</style>