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
            <h1>Fiabilité professionnelle garantie.</h1>
            <p class="posey-text-muted">
              Rejoignez la plateforme de confiance qui connecte clients et prestataires au Togo.
            </p>
          </div>
        </div>

        <div class="auth-panel d-flex flex-column justify-content-center">
          <h2 class="fw-bold mb-1">Connexion</h2>
          <p class="posey-text-muted mb-4">
            Pas encore de compte ?
            <router-link to="/register" class="posey-text-primary text-decoration-none fw-semibold">Créer un compte</router-link>
          </p>

          <form @submit.prevent="login">
            <div v-if="hasError" class="posey-alert posey-alert-danger">{{ errorMessage }}</div>

            <div class="mb-3">
              <label for="username" class="posey-form-label">Nom d'utilisateur</label>
              <input v-model="LoginFormData.username" id="username" type="text" class="posey-input" required autocomplete="username" />
            </div>

            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <label for="password" class="posey-form-label mb-0">Mot de passe</label>
                <router-link to="/forgot_password" class="small posey-text-primary text-decoration-none">Mot de passe oublié ?</router-link>
              </div>
              <input v-model="LoginFormData.password" id="password" type="password" class="posey-input" required autocomplete="current-password" />
            </div>

            <button type="submit" class="posey-btn-primary w-100 py-3 mt-2">Se connecter</button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import api from '../services/api'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

export default {
  name: 'LoginTemplate',
  data() {
    return {
      LoginFormData: { username: '', password: '' },
      hasError: false,
      errorMessage: '',
    }
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  methods: {
    async login() {
      const loader = this.$loading?.show?.()
      try {
        const response = await api.post('user/login/', {
          username: this.LoginFormData.username,
          password: this.LoginFormData.password,
        })

        if (response.data.access && response.data.user) {
          const userWithTokens = {
            ...response.data.user,
            access: response.data.access,
            refresh: response.data.refresh,
          }
          localStorage.setItem('auth_user_data', JSON.stringify(userWithTokens))
          this.hasError = false
          this.errorMessage = ''

          Swal.fire({
            icon: 'success',
            title: 'Bienvenue ' + userWithTokens.username,
            showConfirmButton: false,
            timer: 1500,
          })

          if (userWithTokens.role === 'admin') {
            this.$router.push('/dashboard_admin')
          } else {
            this.$router.push('/')
          }
          this.LoginFormData = { username: '', password: '' }
        } else {
          this.hasError = true
          this.errorMessage = 'Échec de la connexion : réponse inattendue.'
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
