<template>
  <div class="login">
    <div class="container min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="card shadow p-4" style="width: 100%; max-width: 500px;">
        <div class="text-center mb-4">
          <h1 class="text-primary fw-bold">POSEY</h1>
          <h2 class="h4">Connectez-vous à votre compte</h2>
          <p class="text-muted small">
            Ou<router-link to="/register" class="text-decoration-none text-primary">créez votre compte</router-link>
          </p>
        </div>

        <form @submit.prevent="login">
          <alert v-if="hasError" :success="false" :message="errorMessage" />
          <div class="mb-3">
            <label for="username">Nom d'utilisateur</label>
            <input v-model="LoginFormData.username" id="username" type="text" class="form-control" required autocomplete="username"/>
          </div>

          <div class="mb-3">
            <label for="password">Mot de passe</label>
            <input v-model="LoginFormData.password" id="password" type="password" class="form-control" required autocomplete="current-password"/>
          </div>

          <button type="submit" class="btn btn-primary w-100">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../services/api';
  import Alert from "../composants/Alert.vue";
  import { useRouter } from 'vue-router';
  import Swal from 'sweetalert2';

  export default {
    name: 'LoginTemplate',
    components: {
      Alert,
    },
    data() {
      return {
        LoginFormData: {
          username: '',
          password: '',
        },
        hasError: false,
        errorMessage: '',
      };
    },
    setup() {
      const router = useRouter();
      return { router };
    },
    methods: {
      async login() {
        const loader = this.$loading?.show?.();
        try {
          const response = await api.post('user/login/', {
            username: this.LoginFormData.username,
            password: this.LoginFormData.password,
          });

          if (response.data.access && response.data.user) {
              const userWithTokens = {
                  ...response.data.user,
                  access: response.data.access,
                  refresh: response.data.refresh 
              };

              localStorage.setItem('auth_user_data', JSON.stringify(userWithTokens));

              this.hasError = false;
              this.errorMessage = '';

              Swal.fire({
                icon: 'success',
                title: 'Bienvenue ' + userWithTokens.username,
                showConfirmButton: false,
                timer: 1500
              });

              if (userWithTokens.role === 'admin') {
                this.$router.push('/dashboard_admin');
              } else {
                this.$router.push('/');
              }

              this.LoginFormData = { username: '', password: '' };
          } else {
            this.hasError = true;
            this.errorMessage = "Échec de la connexion : réponse inattendue.";
          }
        } catch (error) {
          console.error(error);
          this.hasError = true;
          this.errorMessage = error?.response?.data?.message || "Une erreur inconnue s'est produite.";
        } finally {
          loader.hide();
        }
      },
    },
  };
</script>

<style scoped>
  body {
    background-color: #f8f9fa;
  }
</style>