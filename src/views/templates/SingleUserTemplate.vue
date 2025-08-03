<template>
  <div class="container py-5">
    <div class="bg-white rounded shadow-sm overflow-hidden">
      <!-- Header utilisateur -->
      <div class="bg-primary text-white px-4 py-5 d-flex align-items-center">
        <div class="me-4 position-relative rounded-circle">
          <img src="/img/default-avatar.png" class="rounded-circle border border-white" width="100" height="100" alt="Avatar" />
          <input type="file" ref="fileInput" @change="handleImageChange" accept="image/*" class="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer" />
        </div>
        <div>
          <h2 class="mb-1">{{ formData.prenom }} {{ formData.nom }}</h2>
          <p class="mb-0">
            {{ user.type_compte }}
            <span v-if="isPrestataire"> - Catégorie : {{ user.categorie_nom || 'Non défini' }}</span>
          </p>
        </div>
      </div>

      <!-- Messages -->
      <div v-if="successMessage" class="alert alert-success mt-4">{{ successMessage }}</div>
      <div v-if="errorMessage" class="alert alert-danger mt-4">{{ errorMessage }}</div>

      <!-- Formulaire -->
      <div class="p-4">
        <h4 class="mb-4">Modifier mes informations</h4>
        <form @submit="updateUser">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Prénom</label>
              <input type="text" class="form-control" v-model="formData.prenom" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Nom</label>
              <input type="text" class="form-control" v-model="formData.nom" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" v-model="formData.email" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Quartier</label>
              <input type="text" class="form-control" v-model="formData.quartier" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Ville</label>
              <input type="text" class="form-control" v-model="formData.ville" />
            </div>

            <div class="col-md-6" v-if="isPrestataire">
              <label class="form-label">Catégorie</label>
              <select v-model.number="formData.categorie" class="form-select">
                <option v-for="cat in categories" :value="cat.id" :key="cat.id">
                  {{ cat.nom }}
                </option>
              </select>
            </div>
          </div>

          <div class="d-flex justify-content-between mt-4">
            <button type="button" class="btn btn-outline-danger" @click="deleteUser">Supprimer mon compte</button>
            <button type="submit" class="btn btn-primary">Enregistrer</button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script>
  import api from '../services/api'

  export default {
    data() {
      return {
        user: {},
        userId: null,
        formData: {
          nom: "",
          prenom: "",
          email: "",
          ville: "",
          quartier: "",
          categorie: "",
        },
        categorieData: [],
        selectedFile: null,
        previewImage: "",
        successMessage: null,
        errorMessage: null,
      }
    },
    computed: {
      isPrestataire() {
        return this.user.type_compte === "prestataire"
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
          this.previewImage = res.data.image || "/default-avatar.png"
        } catch {
          this.errorMessage = "Erreur lors du chargement de l'utilisateur"
        }
      },
      async fetchCategories() {
        try {
          const res = await api.get("/prestation/detail_categorie/")
          this.categorieData = res.data
        } catch {
          this.errorMessage = "Erreur lors du chargement des catégories"
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
          formData.append("image", this.selectedFile)
        }
        try {
          await api.put(`/user/update/${this.userId}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          this.successMessage = "Mise à jour réussie."
          this.errorMessage = null
          setTimeout(() => (this.successMessage = null), 3000)
          this.fetchUser()
        } catch {
          this.errorMessage = "Erreur lors de la mise à jour."
          this.successMessage = null
        }
      },
      async deleteUser() {
        if (!confirm("Supprimer votre compte ? Action irréversible.")) return
        try {
          await api.delete(`/user/update/${this.userId}/`)
          localStorage.removeItem("auth_user_data")
          this.$router.push("/register")
        } catch {
          this.errorMessage = "Erreur lors de la suppression du compte."
        }
      },
    },
    created() {
      const user = localStorage.getItem("auth_user_data")
      console.log("USER LOCAL:", user)
      if (user) {
        this.userId = JSON.parse(user).id
        this.fetchUser()
        this.fetchCategories()
      } else {
        this.errorMessage = "Utilisateur non connecté"
      }
    },
  }
</script>