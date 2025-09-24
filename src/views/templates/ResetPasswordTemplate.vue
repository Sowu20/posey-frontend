<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card p-4 shadow" style="width: 400px;">
      <h4 class="text-center mb-3">Nouveau mot de passe</h4>
      <form @submit.prevent="resetPassword">
        <div class="mb-3">
          <label for="password">Nouveau mot de passe</label>
          <input v-model="password" type="password" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="confirm">Confirmer le mot de passe</label>
          <input v-model="confirmPassword" type="password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-success w-100">Réinitialiser</button>
      </form>
    </div>
  </div>
</template>

<script>
  import api from '../services/api';
  import Swal from 'sweetalert2';

  export default {
    name: 'ResetPasswordTemplate',
    data() {
      return {
        password: "",
        confirmPassword: "",
      };
    },
    methods: {
      async resetPassword() {
        if (this.password !== this.confirmPassword) {
          Swal.fire("Erreur", "Les mots de passe ne correspondent pas!", "error")
          return;
        }

        const { token } = this.$route.params;

        try {
          const res = await api.post(`reset_password_confirm/${token}/`, {
            password: this.password,
          });
          Swal.fire("Succès", res.data.message, "success");
          this.$router.push("/login");
        } catch (error) {
          Swal.fire("Erreur", error.response?.data?.error || "Lien invalide ou expiré!", "error");
        }

      }
    }
  }
</script>
