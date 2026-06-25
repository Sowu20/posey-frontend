<template>
  <div class="auth-page">
    <header class="auth-header">
      <router-link to="/" class="auth-brand">POSEY</router-link>
      <router-link to="/" class="auth-back">
        <i class="fas fa-arrow-left"></i> Retour à l'accueil
      </router-link>
    </header>

    <main class="auth-main">
      <div class="auth-split">
        <div class="auth-hero">
          <div class="auth-hero-bg"></div>
          <div class="auth-hero-content">
            <h1>Rejoignez POSEY.</h1>
            <p class="posey-text-muted">
              Clients ou prestataires — créez votre compte en quelques minutes.
            </p>
          </div>
        </div>

        <div class="auth-panel">
          <h2 class="fw-bold mb-1">Inscription</h2>
          <p class="posey-text-muted mb-4">
            Déjà inscrit ?
            <router-link to="/login" class="posey-text-primary text-decoration-none fw-semibold">Se connecter</router-link>
          </p>

          <form @submit.prevent="register">
            <div v-if="hasError" class="posey-alert posey-alert-danger">{{ errorMessage }}</div>
            <div v-if="hasSuccess" class="posey-alert posey-alert-success">{{ successMessage }}</div>

            <div class="row g-3">
              <div class="col-md-6">
                <label for="username" class="posey-form-label">Nom d'utilisateur</label>
                <input v-model="registerFormData.username" id="username" type="text" class="posey-input" required autocomplete="username" />
              </div>
              <div class="col-md-6">
                <label for="email" class="posey-form-label">Email</label>
                <input v-model="registerFormData.email" id="email" type="email" class="posey-input" required autocomplete="email" />
              </div>
              <div class="col-md-6">
                <label for="nom" class="posey-form-label">Nom</label>
                <input v-model="registerFormData.nom" id="nom" type="text" class="posey-input" required />
              </div>
              <div class="col-md-6">
                <label for="prenom" class="posey-form-label">Prénom</label>
                <input v-model="registerFormData.prenom" id="prenom" type="text" class="posey-input" required />
              </div>
              <div class="col-md-6">
                <label for="password" class="posey-form-label">Mot de passe</label>
                <input v-model="registerFormData.password" id="password" type="password" class="posey-input" required autocomplete="new-password" />
              </div>
              <div class="col-md-6">
                <label for="role" class="posey-form-label">Type de compte</label>
                <select v-model="registerFormData.role" id="role" class="posey-select" required>
                  <option value="client">Client</option>
                  <option value="prestataire">Prestataire</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div class="col-md-6">
                <label for="quartier" class="posey-form-label">Quartier</label>
                <input v-model="registerFormData.quartier" id="quartier" type="text" class="posey-input" required />
              </div>
              <div class="col-md-6">
                <label for="ville" class="posey-form-label">Ville</label>
                <input v-model="registerFormData.ville" id="ville" type="text" class="posey-input" required />
              </div>
              <div class="col-12" v-if="registerFormData.role === 'prestataire'">
                <label for="categorie" class="posey-form-label">Catégorie</label>
                <input v-model="registerFormData.categorie" id="categorie" type="text" class="posey-input" required />
              </div>
            </div>

            <button type="submit" class="posey-btn-primary w-100 py-3 mt-4">Créer mon compte</button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'RegisterTemplate',
  data() {
    return {
      registerFormData: {
        username: '',
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 'client',
        quartier: '',
        ville: '',
        categorie: '',
      },
      errorMessage: '',
      successMessage: '',
      hasError: false,
      hasSuccess: false,
    }
  },
  methods: {
    async register() {
      const loader = this.$loading?.show?.()
      try {
        const payload = { ...this.registerFormData }
        if (this.registerFormData.role !== 'prestataire') delete payload.categorie

        const response = await api.post('user/register/', payload)

        if (response.data?.username) {
          this.hasSuccess = true
          this.successMessage = 'Inscription réussie. Redirection...'
          this.hasError = false
          setTimeout(() => this.$router.push('/login'), 1000)
        } else {
          this.hasError = true
          this.errorMessage = "Échec de l'inscription : réponse inattendue."
        }
      } catch (error) {
        console.error(error)
        this.hasError = true
        this.errorMessage = error?.response?.data?.message || "Une erreur inconnue s'est produite."
      } finally {
        loader?.hide?.()
      }
    },
  },
}
</script>
