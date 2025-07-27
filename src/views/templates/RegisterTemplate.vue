<template>
  <div class="register">
    <div class="container min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="card shadow p-4" style="width: 100%; max-width: 500px;">
        <div class="text-center mb-4">
          <h1 class="text-primary fw-bold">POSEY</h1>
          <h2 class="h4">Créez un nouveau compte</h2>
          <p class="text-muted small">
            Ou
            <router-link to="/login" class="text-decoration-none text-primary">
              connectez-vous à votre compte
            </router-link>
          </p>
        </div>

        <form @submit.prevent="register">
          <alert v-if="hasError" :success="false" :message="errorMessage" />
          <alert v-if="hasSuccess" :success="true" :message="successMessage" />

          <div class="mb-3">
            <label for="username">Nom d'utilisateur</label>
            <input v-model="registerFormData.username" id="username" type="text" class="form-control" required autocomplete="username" />
          </div>

          <div class="mb-3">
            <label for="nom">Nom</label>
            <input v-model="registerFormData.nom" id="nom" type="text" class="form-control" required />
          </div>

          <div class="mb-3">
            <label for="prenom">Prénom</label>
            <input v-model="registerFormData.prenom" id="prenom" type="text" class="form-control" required />
          </div>

          <div class="mb-3">
            <label for="email">Adresse email</label>
            <input v-model="registerFormData.email" id="email" type="email" class="form-control" required autocomplete="email" />
          </div>

          <div class="mb-3">
            <label for="password">Mot de passe</label>
            <input v-model="registerFormData.password" id="password" type="password" class="form-control" required autocomplete="new-password" />
          </div>

          <div class="mb-3">
            <label for="role">Type de compte</label>
            <select v-model="registerFormData.role" id="role" class="form-select" required>
              <option value="client">Client</option>
              <option value="prestataire">Prestataire</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="quartier">Quartier</label>
            <input v-model="registerFormData.quartier" id="quartier" type="text" class="form-control" required />
          </div>

          <div class="mb-3">
            <label for="ville">Ville</label>
            <input v-model="registerFormData.ville" id="ville" type="text" class="form-control" required />
          </div>

          <div class="mb-3" v-if="registerFormData.role === 'prestataire'">
            <label for="categorie">Catégorie</label>
            <input v-model="registerFormData.categorie" id="categorie" type="text" class="form-control" required />
          </div>

          <button type="submit" class="btn btn-lg btn-primary w-100">
            Créer un compte
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../services/api';
  import Alert from "../composants/Alert.vue";

  export default {
    name: 'RegisterTemplate',
    components: {
      Alert,
    },
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
      };
    },
    methods: {
      async register() {
        const loader = this.$loading?.show?.();
        try {
          const payload = {
            username: this.registerFormData.username,
            nom: this.registerFormData.nom,
            prenom: this.registerFormData.prenom,
            email: this.registerFormData.email,
            password: this.registerFormData.password,
            role: this.registerFormData.role,
            quartier: this.registerFormData.quartier,
            ville: this.registerFormData.ville,
          };

          if (this.registerFormData.role === 'prestataire') {
            payload.categorie = this.registerFormData.categorie;
          }

          const response = await api.post('user/register/', payload);

          if (response.data?.username) {
            this.hasSuccess = true;
            this.successMessage = "Inscription réussie. Redirection...";
            this.hasError = false;
            this.errorMessage = "";
            setTimeout(() => {
              this.$router.push('/login');
            }, 1000);
          } else {
            this.hasError = true;
            this.errorMessage = "Échec de l'inscription : réponse inattendue.";
          }
        } catch (error) {
          console.error(error);
          this.hasError = true;
          this.errorMessage = error?.response?.data?.message || "Une erreur inconnue s'est produite.";
        } finally {
          loader?.hide?.();
        }
      }
    }
  }
</script>

<style scoped>
  body {
    background-color: #f8f9fa;
  }
</style>