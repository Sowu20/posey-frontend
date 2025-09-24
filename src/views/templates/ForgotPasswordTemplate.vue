<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card p-4 shadow" style="width: 400px;">
      <h4 class="text-center mb-3">Réinitialisatier votre mot de passe</h4>
      <form @submit.prevent="submitEmail">
        <div class="mb-3">
          <label for="email">Votre saisir votre e-mail</label>
          <input v-model="email" type="email" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary w-100">Envoyer</button>
      </form>
    </div>
  </div>
</template>

<script>
  import api from '../services/api';
  import Swal from 'sweetalert2';

  export default {
    name: 'ForgotPasswordTemplate',
    data() {
      return {
        email: ''
      };
    },
    methods: {
      async submitEmail() {
        try {
          const res = await api.post('reset_password/', { email: this.email });
          Swal.fire("Succès", res.data.message, "success");
        } catch (error) {
          Swal.fire("Erreur", error.response?.data?.error || "Une erreur est survenue", "error");
        }
      },
    },
  }
</script>
