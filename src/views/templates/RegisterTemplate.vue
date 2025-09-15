<template>
  <div class="register">
    <div class="container min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div class="card shadow-lg p-4 border-0 rounded-4" style="width: 100%; max-width: 800px;">

        <!-- En-tête -->
        <div class="text-center mb-4">
          <h1 class="text-primary fw-bold">POSEY</h1>
          <h2 class="h5 fw-semibold">Créez un nouveau compte</h2>
          <p class="text-muted small">
            Déjà inscrit ?
            <router-link to="/login" class="text-decoration-none fw-semibold text-primary">
              Connectez-vous
            </router-link>
          </p>
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="register">
          <alert v-if="hasError" :success="false" :message="errorMessage" />
          <alert v-if="hasSuccess" :success="true" :message="successMessage" />

          <div class="row g-3">
            <div class="col-md-6">
              <label for="username" class="form-label">Nom d'utilisateur</label>
              <input v-model="registerFormData.username" id="username" type="text" class="form-control rounded-3" required autocomplete="username" />
            </div>

            <div class="col-md-6">
              <label for="email" class="form-label">Adresse email</label>
              <input v-model="registerFormData.email" id="email" type="email" class="form-control rounded-3" required autocomplete="email" />
            </div>

            <div class="col-md-6">
              <label for="nom" class="form-label">Nom</label>
              <input v-model="registerFormData.nom" id="nom" type="text" class="form-control rounded-3" required />
            </div>

            <div class="col-md-6">
              <label for="prenom" class="form-label">Prénom</label>
              <input v-model="registerFormData.prenom" id="prenom" type="text" class="form-control rounded-3" required />
            </div>

            <div class="col-md-6">
              <label for="password" class="form-label">Mot de passe</label>
              <input v-model="registerFormData.password" id="password" type="password" class="form-control rounded-3" required autocomplete="new-password" />
            </div>

            <div class="col-md-6">
              <label for="role" class="form-label">Type de compte</label>
              <select v-model="registerFormData.role" id="role" class="form-select rounded-3" required>
                <option value="client">Client</option>
                <option value="prestataire">Prestataire</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div class="col-md-6">
              <label for="quartier" class="form-label">Quartier</label>
              <input v-model="registerFormData.quartier" id="quartier" type="text" class="form-control rounded-3" required />
            </div>

            <div class="col-md-6">
              <label for="ville" class="form-label">Ville</label>
              <input v-model="registerFormData.ville" id="ville" type="text" class="form-control rounded-3" required />
            </div>

            <div class="col-12" v-if="registerFormData.role === 'prestataire'">
              <label for="categorie" class="form-label">Catégorie</label>
              <input v-model="registerFormData.categorie" id="categorie" type="text" class="form-control rounded-3" required />
            </div>
          </div>

          <button type="submit" class="btn btn-lg btn-primary w-100 rounded-3 fw-semibold shadow-sm mt-4">
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
    components: { Alert },
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
          const payload = { ...this.registerFormData };
          if (this.registerFormData.role !== 'prestataire') delete payload.categorie;

          const response = await api.post('user/register/', payload);

          if (response.data?.username) {
            this.hasSuccess = true;
            this.successMessage = "Inscription réussie. Redirection...";
            this.hasError = false;
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
  };
</script>

<style scoped>
  .register label {
    font-weight: 500;
  }
</style>
