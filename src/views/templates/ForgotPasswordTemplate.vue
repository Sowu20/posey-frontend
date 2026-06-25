<template>
  <div class="auth-page">
    <header class="auth-header">
      <router-link to="/" class="auth-brand">POSEY</router-link>
      <router-link to="/login" class="auth-back">
        <i class="fas fa-arrow-left"></i> Retour à la connexion
      </router-link>
    </header>

    <main class="auth-main">
      <div class="auth-card mx-auto">
        <div class="auth-icon-circle">
          <i class="fas fa-lock"></i>
        </div>
        <h1 class="h4 fw-bold text-center mb-2">Mot de passe oublié</h1>
        <p class="posey-text-muted text-center mb-4">
          Saisissez votre email et nous vous enverrons un lien de réinitialisation.
        </p>

        <form @submit.prevent="submitEmail">
          <div class="mb-4">
            <label for="email" class="posey-form-label">Adresse email</label>
            <input id="email" v-model="email" type="email" class="posey-input" placeholder="nom@exemple.com" required />
          </div>
          <button type="submit" class="posey-btn-primary w-100 py-3">
            Envoyer le lien <i class="fas fa-arrow-right ms-2"></i>
          </button>
        </form>

        <p class="text-center posey-text-muted mt-4 mb-0">
          Vous vous souvenez ?
          <router-link to="/login" class="posey-text-primary text-decoration-none fw-semibold">Se connecter</router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import api from '../services/api'
import Swal from 'sweetalert2'

export default {
  name: 'ForgotPasswordTemplate',
  data() {
    return { email: '' }
  },
  methods: {
    async submitEmail() {
      try {
        const res = await api.post('user/reset_password/', { email: this.email })
        Swal.fire('Succès', res.data.message, 'success')
      } catch (error) {
        Swal.fire('Erreur', error.response?.data?.error || 'Une erreur est survenue', 'error')
      }
    },
  },
}
</script>
