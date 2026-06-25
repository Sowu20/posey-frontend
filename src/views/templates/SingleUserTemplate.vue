<template>
  <div class="posey-container py-5">
    <div class="posey-card overflow-hidden">
      <div class="profile-header">
        <div class="position-relative">
          <img :src="previewImage || '/img/default-avatar.png'" class="profile-avatar" alt="Avatar" />
          <input
            type="file"
            ref="fileInput"
            @change="handleImageChange"
            accept="image/*"
            class="position-absolute top-0 start-0 w-100 h-100 opacity-0"
            style="cursor: pointer;"
          />
        </div>
        <div>
          <h2 class="mb-1 fw-bold">{{ formData.prenom }} {{ formData.nom }}</h2>
          <p class="mb-0 opacity-75">
            {{ user.type_compte }}
            <span v-if="isPrestataire"> — {{ user.categorie_nom || 'Catégorie non définie' }}</span>
          </p>
        </div>
      </div>

      <div class="p-4">
        <div v-if="successMessage" class="posey-alert posey-alert-success">{{ successMessage }}</div>
        <div v-if="errorMessage" class="posey-alert posey-alert-danger">{{ errorMessage }}</div>

        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h4 class="fw-bold mb-0">Modifier mes informations</h4>
          <button type="button" class="posey-btn-outline posey-btn-sm" @click="openPasswordModal">
            Changer mon mot de passe
          </button>
        </div>

        <form @submit="updateUser">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="posey-form-label">Prénom</label>
              <input type="text" class="posey-input" v-model="formData.prenom" />
            </div>
            <div class="col-md-6">
              <label class="posey-form-label">Nom</label>
              <input type="text" class="posey-input" v-model="formData.nom" />
            </div>
            <div class="col-md-6">
              <label class="posey-form-label">Email</label>
              <input type="email" class="posey-input" v-model="formData.email" />
            </div>
            <div class="col-md-6">
              <label class="posey-form-label">Quartier</label>
              <input type="text" class="posey-input" v-model="formData.quartier" />
            </div>
            <div class="col-md-6">
              <label class="posey-form-label">Ville</label>
              <input type="text" class="posey-input" v-model="formData.ville" />
            </div>
            <div class="col-md-6" v-if="isPrestataire">
              <label class="posey-form-label">Catégorie</label>
              <select v-model.number="formData.categorie" class="posey-select">
                <option v-for="cat in categorieData" :value="cat.id" :key="cat.id">{{ cat.nom }}</option>
              </select>
            </div>
          </div>

          <div class="d-flex justify-content-between mt-4 flex-wrap gap-2">
            <button type="button" class="posey-btn-danger" @click="deleteUser">Supprimer mon compte</button>
            <button type="submit" class="posey-btn-primary px-4">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal fade" id="passwordModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Changer mon mot de passe</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form @submit.prevent="changePassword">
            <div class="modal-body">
              <div class="mb-3">
                <label class="posey-form-label">Nouveau mot de passe</label>
                <input type="password" v-model="passwordData.new_password" class="posey-input" required />
              </div>
              <div class="mb-3">
                <label class="posey-form-label">Confirmer le mot de passe</label>
                <input type="password" v-model="passwordData.confirm_password" class="posey-input" required />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="posey-btn-outline" data-bs-dismiss="modal">Annuler</button>
              <button type="submit" class="posey-btn-primary">Mettre à jour</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'
import { Modal } from 'bootstrap'

export default {
  name: 'SingleUserTemplate',
  data() {
    return {
      user: {},
      userId: null,
      formData: {
        nom: '',
        prenom: '',
        email: '',
        ville: '',
        quartier: '',
        categorie: '',
      },
      categorieData: [],
      selectedFile: null,
      previewImage: '',
      successMessage: null,
      errorMessage: null,
      passwordData: {
        new_password: '',
        confirm_password: '',
      },
      passwordModal: null,
    }
  },
  computed: {
    isPrestataire() {
      return this.user.type_compte === 'prestataire'
    },
  },
  methods: {
    async fetchUser() {
      try {
        const res = await api.get(`/user/${this.userId}/`)
        this.user = res.data
        this.formData = {
          nom: res.data.nom,
          prenom: res.data.prenom,
          email: res.data.email,
          ville: res.data.ville,
          quartier: res.data.quartier,
          categorie: res.data.categorie,
        }
        this.previewImage = res.data.image || '/img/default-avatar.png'
      } catch {
        this.errorMessage = "Erreur lors du chargement de l'utilisateur"
      }
    },
    async fetchCategories() {
      try {
        const res = await api.get('/prestation/detail_categorie/')
        this.categorieData = res.data
      } catch {
        this.errorMessage = 'Erreur lors du chargement des catégories'
      }
    },
    handleImageChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFile = file
        this.previewImage = URL.createObjectURL(file)
      }
    },
    async updateUser(e) {
      e.preventDefault()
      const formData = new FormData()
      for (const key in this.formData) {
        formData.append(key, this.formData[key])
      }
      if (this.selectedFile) {
        formData.append('image', this.selectedFile)
      }
      try {
        await api.put(`/user/update/${this.userId}/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        this.successMessage = 'Mise à jour réussie.'
        this.errorMessage = null
        setTimeout(() => (this.successMessage = null), 3000)
        this.fetchUser()
      } catch {
        this.errorMessage = 'Erreur lors de la mise à jour.'
        this.successMessage = null
      }
    },
    async deleteUser() {
      if (!confirm('Supprimer votre compte ? Action irréversible.')) return
      try {
        await api.delete(`/user/update/${this.userId}/`)
        localStorage.removeItem('auth_user_data')
        this.$router.push('/register')
      } catch {
        this.errorMessage = 'Erreur lors de la suppression du compte.'
      }
    },
    openPasswordModal() {
      if (!this.passwordModal) {
        this.passwordModal = new Modal(document.getElementById('passwordModal'))
      }
      this.passwordModal.show()
    },
    async changePassword() {
      if (this.passwordData.new_password !== this.passwordData.confirm_password) {
        this.errorMessage = 'Les mots de passe ne correspondent pas.'
        return
      }
      try {
        const user = JSON.parse(localStorage.getItem('auth_user_data'))
        if (!user?.id || !user?.access) return

        await api.put(
          'user/change_password/',
          { new_password: this.passwordData.new_password },
          { headers: { Authorization: `Bearer ${user.access}` } },
        )
        this.successMessage = 'Mot de passe mis à jour'
        this.errorMessage = null
        setTimeout(() => {
          this.passwordModal.hide()
          this.passwordData.new_password = ''
          this.passwordData.confirm_password = ''
          this.successMessage = null
        }, 1500)
      } catch {
        this.errorMessage = 'Erreur lors du changement de mot de passe'
        this.successMessage = null
      }
    },
  },
  created() {
    const user = localStorage.getItem('auth_user_data')
    if (user) {
      this.userId = JSON.parse(user).id
      this.fetchUser()
      this.fetchCategories()
    } else {
      this.errorMessage = 'Utilisateur non connecté'
    }
  },
}
</script>
