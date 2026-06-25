<template>
  <div>
    <div class="posey-table-wrap mb-4">
      <table class="posey-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Type</th>
            <th>Quartier</th>
            <th>Ville</th>
            <th>Catégorie</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in utilisateursPagines" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.nom }}</td>
            <td>{{ user.prenom }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.quartier }}</td>
            <td>{{ user.ville }}</td>
            <td>{{ user.categorie ? user.categorie.nom : '-' }}</td>
            <td>{{ formatDate(user.date_inscription) }}</td>
            <td>
              <div class="d-flex gap-2">
                <button class="posey-btn-warning" @click="ouvrirModalEdition(user)">Modifier</button>
                <button class="posey-btn-danger posey-btn-sm" @click="confirmerSuppression(user)">Supprimer</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ul class="posey-pagination">
      <li>
        <button @click="changerPage(page - 1)" :disabled="page === 1">Précédent</button>
      </li>
      <li v-for="p in totalPages" :key="p">
        <button :class="{ active: p === page }" @click="changerPage(p)">{{ p }}</button>
      </li>
      <li>
        <button @click="changerPage(page + 1)" :disabled="page === totalPages">Suivant</button>
      </li>
    </ul>

    <!-- Modal -->
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modifier l'utilisateur</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
          </div>
          <div class="modal-body" v-if="utilisateurActuel">
            <form @submit.prevent="soumettreModification">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label>Nom</label>
                  <input type="text" class="form-control" v-model="utilisateurActuel.nom" />
                </div>

                <div class="col-md-6 mb-3">
                  <label>Prénom</label>
                  <input type="text" class="form-control" v-model="utilisateurActuel.prenom" />
                </div>

                <div class="col-md-6 mb-3">
                  <label>Email</label>
                  <input type="email" class="form-control" v-model="utilisateurActuel.email" />
                </div>

                <div class="col-md-6 mb-3">
                  <label>Quartier</label>
                  <input type="text" class="form-control" v-model="utilisateurActuel.quartier" />
                </div>

                <div class="col-md-6 mb-3">
                  <label>Ville</label>
                  <input type="text" class="form-control" v-model="utilisateurActuel.ville" />
                </div>

                <div class="col-md-6 mb-3">
                  <label>Rôle</label>
                  <select class="form-select" v-model="utilisateurActuel.role">
                    <option value="client">Client</option>
                    <option value="prestataire">Prestataire</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div class="col-md-6 mb-3" v-if="utilisateurActuel.role === 'prestataire'">
                  <label>Catégorie</label>
                  <select class="form-select" v-model="utilisateurActuel.categorie">
                    <option disabled value="">Choisir une catégorie</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
                  </select>
                </div>
              </div>

              <div class="text-end">
                <button class="posey-btn-primary" type="submit">Enregistrer</button>
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
    name: 'GestionUtilisateur',
    data() {
      return {
        utilisateurs: [],
        page: 1,
        utilisateursParPage: 5,
        utilisateurActuel: null,
        categories: [],
      }
    },
    computed: {
      totalPages() {
        return Math.ceil(this.utilisateurs.length / this.utilisateursParPage)
      },
      utilisateursPagines() {
        const start = (this.page - 1) * this.utilisateursParPage
        return this.utilisateurs.slice(start, start + this.utilisateursParPage)
      }
    },
    methods: {
      changerPage(nouvellePage) {
        if (nouvellePage >= 1 && nouvellePage <= this.totalPages) {
          this.page = nouvellePage
        }
      },
      formatDate(dateStr) {
        if (!dateStr) return ''
        const options = {
          weekday: 'short',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          // hour: '2-digit',
          // minute: '2-digit',
        }
        return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateStr))
      },
      ouvrirModalEdition(user) {
        this.utilisateurActuel = {
          ...user,
          categorie: user.categorie?.id || '', // s'assurer que c'est l'ID
        }
        const modal = new bootstrap.Modal(document.getElementById('editModal'))
        modal.show()
      },
      async soumettreModification() {
        try {
          const id = this.utilisateurActuel.id
          const response = await api.put(`user/update/${id}/`, this.utilisateurActuel)

          const index = this.utilisateurs.findIndex(u => u.id === id)
          if (index !== -1) {
            this.utilisateurs[index] = response.data
          }

          Swal.fire('Succès', 'Utilisateur modifié avec succès.', 'success')
          const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'))
          modal.hide()
        } catch (error) {
          console.error(error)
          Swal.fire('Erreur', 'Échec de la mise à jour.', 'error')
        }
      },
      confirmerSuppression(user) {
        Swal.fire({
          title: 'Supprimer cet utilisateur ?',
          text: `Cette action est irréversible !`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#6c757d',
          confirmButtonText: 'Oui, supprimer',
          cancelButtonText: 'Annuler'
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              await api.delete(`user/delete/${user.id}/`)
              this.utilisateurs = this.utilisateurs.filter(u => u.id !== user.id)
              Swal.fire('Supprimé !', 'Utilisateur supprimé avec succès.', 'success')
            } catch (error) {
              console.error(error)
              Swal.fire('Erreur', 'Impossible de supprimer cet utilisateur.', 'error')
            }
          }
        })
      }
    },
    async mounted() {
      try {
        const [usersRes, catsRes] = await Promise.all([
          api.get('user/detail/'),
          api.get('/prestation/detail_categorie/'),
        ])
        this.utilisateurs = usersRes.data
        this.categories = catsRes.data
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error)
      }
    }
  }
</script>

<style scoped>
  .table th,
  .table td {
    vertical-align: middle;
    font-size: 0.9rem;
    padding: 0.75rem;
  }

  .table thead th {
    font-weight: 600;
    text-transform: capitalize;
  }

  h2 {
    font-size: 1.8rem;
  }

  .pagination .page-link {
    border-radius: 0.25rem;
  }
</style>