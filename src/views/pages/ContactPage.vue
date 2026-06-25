<template>
  <default-layout>
    <section class="posey-hero">
      <div class="posey-container">
        <h1 class="posey-hero-title">Contactez-nous</h1>
        <p class="posey-hero-subtitle">
          Une question sur POSEY ou besoin d'aide ? Notre équipe est là pour vous accompagner.
        </p>
      </div>
    </section>

    <section class="pb-5">
      <div class="posey-container">
        <div class="row g-4 align-items-start">
          <div class="col-lg-7">
            <div class="posey-card-glass p-4 p-md-5">
              <h2 class="fw-bold mb-4">Envoyez-nous un message</h2>
              <form @submit.prevent>
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="posey-form-label">Prénom</label>
                    <input type="text" class="posey-input" placeholder="Jean" required />
                  </div>
                  <div class="col-md-6">
                    <label class="posey-form-label">Nom</label>
                    <input type="text" class="posey-input" placeholder="Dupont" required />
                  </div>
                </div>
                <div class="mb-3">
                  <label class="posey-form-label">Email</label>
                  <input type="email" class="posey-input" placeholder="jean@exemple.com" required />
                </div>
                <div class="mb-3">
                  <label class="posey-form-label">Téléphone</label>
                  <input type="tel" class="posey-input" placeholder="+228 XX XX XX XX" />
                </div>
                <div class="mb-3">
                  <label class="posey-form-label">Sujet</label>
                  <select class="posey-select" required>
                    <option value="">Sélectionnez un sujet</option>
                    <option value="support">Support technique</option>
                    <option value="account">Problème de compte</option>
                    <option value="payment">Problème de paiement</option>
                    <option value="provider">Devenir prestataire</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div class="mb-4">
                  <label class="posey-form-label">Message</label>
                  <textarea class="posey-textarea" rows="5" placeholder="Décrivez votre demande..." required></textarea>
                </div>
                <button type="submit" class="posey-btn-primary px-4 py-3">
                  <i class="fas fa-paper-plane me-2"></i>Envoyer le message
                </button>
              </form>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="posey-card-glass p-4 p-md-5 mb-4">
              <h3 class="fw-bold mb-4">Coordonnées</h3>
              <div class="d-flex gap-3 mb-4">
                <div class="posey-icon-box"><i class="fas fa-envelope"></i></div>
                <div>
                  <p class="posey-form-label mb-1">Email</p>
                  <p class="mb-0">contact@kofcorporation.com</p>
                </div>
              </div>
              <div class="d-flex gap-3 mb-4">
                <div class="posey-icon-box"><i class="fas fa-phone"></i></div>
                <div>
                  <p class="posey-form-label mb-1">Téléphone</p>
                  <p class="mb-0">+228 93 55 47 40</p>
                  <p class="posey-text-muted small mb-0">Lun - Ven, 8h - 18h</p>
                </div>
              </div>
              <div class="d-flex gap-3">
                <div class="posey-icon-box"><i class="fas fa-map-marker-alt"></i></div>
                <div>
                  <p class="posey-form-label mb-1">Adresse</p>
                  <p class="mb-0">Agoè Cacaveli Bluezone, Lomé, Togo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </default-layout>
</template>

<script>
import DefaultLayout from './Layout.vue'

export default {
  name: 'ContactPage',
  components: { DefaultLayout },
}
</script>
