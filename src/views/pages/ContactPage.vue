<template>
  <default-layout>
    <section class="bg-primary text-white text-center py-5">
      <div class="container">
        <h1 class="display-4 fw-bold mb-3">Contactez-Nous</h1>
        <p class="lead">Notre équipe support est là pour vous aider. N'hésitez pas à nous contacter.</p>
      </div>
    </section>

    <div class="container py-5">
      <div class="row g-4">
        <!-- Formulaire -->
        <div class="col-lg-18">
          <div class="card shadow-sm p-4">
            <h2 class="h4 mb-4">Envoyez-nous un message</h2>
            <form>
              <div class="row mb-3">
                <div class="col">
                  <label class="form-label">Prénom </label>
                  <input type="text" class="form-control" required>
                </div>
                <div class="col">
                  <label class="form-label">Nom</label>
                  <input type="text" class="form-control" required>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Téléphone</label>
                <input type="tel" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label">Sujet</label>
                <select class="form-select" required>
                  <option value="">Sélectionnez un sujet</option>
                  <option value="support">Support technique</option>
                  <option value="account">Problème de compte</option>
                  <option value="payment">Problème de paiement</option>
                  <option value="provider">Devenir prestataire</option>
                  <option value="partnership">Partenariat</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Message</label>
                <textarea rows="5" class="form-control" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">Envoyer</button>
            </form>
          </div>
        </div>

      </div>
    </div>

  </default-layout>
</template>

<script>
  import DefaultLayout from './Layout.vue';
  export default {
    name: 'ContactPage',
    components: {
      DefaultLayout,
    },
  }
</script>

<style scoped>
  .hover-shadow:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
  }
</style>