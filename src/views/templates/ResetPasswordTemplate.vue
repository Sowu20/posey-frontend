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
          <i class="fas fa-shield-alt"></i>
        </div>
        <h1 class="h4 fw-bold text-center mb-2">Nouveau mot de passe</h1>
        <p class="posey-text-muted text-center mb-4">
          Choisissez un mot de passe fort pour sécuriser votre compte.
        </p>

        <form @submit.prevent="resetPassword">
          <div class="mb-3">
            <label class="posey-form-label">Nouveau mot de passe</label>
            <input v-model="password" type="password" class="posey-input" required />
          </div>
          <div class="mb-4">
            <label class="posey-form-label">Confirmer le mot de passe</label>
            <input v-model="confirmPassword" type="password" class="posey-input" required />
          </div>
          <button type="submit" class="posey-btn-primary w-100 py-3">Réinitialiser</button>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
import api from '../services/api'
import Swal from 'sweetalert2'

export default {
  name: 'ResetPasswordTemplate',
  data() {
    return {
      password: '',
      confirmPassword: '',
    }
  },
  methods: {
    async resetPassword() {
      if (this.password !== this.confirmPassword) {
        Swal.fire('Erreur', 'Les mots de passe ne correspondent pas!', 'error')
        return
      }

      const { uid, token } = this.$route.params

      try {
        const res = await api.post(`user/reset_password_confirm/${uid}/${token}/`, {
          password: this.password,
        })
        Swal.fire('Succès', res.data.message, 'success')
        this.$router.push('/login')
      } catch (error) {
        Swal.fire('Erreur', error.response?.data?.error || 'Lien invalide ou expiré!', 'error')
      }
    },
  },
}
</script>
