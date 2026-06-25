<template>
  <default-layout>
    <section class="posey-hero">
      <div class="posey-container">
        <h1 class="posey-hero-title">À propos de POSEY</h1>
        <p class="posey-hero-subtitle">
          La plateforme qui révolutionne la mise en relation entre clients et prestataires de services au Togo.
        </p>
      </div>
    </section>

    <section class="pb-5">
      <div class="posey-container">
        <div class="text-center mb-5">
          <h2 class="posey-section-title">Notre mission</h2>
          <p class="posey-section-subtitle mx-auto" style="max-width: 700px;">
            Faciliter la mise en relation entre la population et les prestataires qualifiés pour améliorer le quotidien de chacun.
          </p>
        </div>

        <div class="row align-items-center g-5 mb-5">
          <div class="col-md-6">
            <img src="/img/relation1.png" alt="Notre mission" class="img-fluid rounded-3 border" style="border-color: var(--posey-border) !important;" />
          </div>
          <div class="col-md-6">
            <div class="d-flex gap-3 mb-4">
              <div class="posey-icon-box fs-4">🎯</div>
              <div>
                <h5 class="fw-semibold mb-2">Objectif principal</h5>
                <p class="posey-text-muted mb-0">Permettre la mise en relation facile avec les prestataires (Maçon, Menuisier, Plombier, etc.).</p>
              </div>
            </div>
            <div class="d-flex gap-3 mb-4">
              <div class="posey-icon-box fs-4">📈</div>
              <div>
                <h5 class="fw-semibold mb-2">Amélioration continue</h5>
                <p class="posey-text-muted mb-0">Offrir plus de visibilité et d'opportunités aux prestataires.</p>
              </div>
            </div>
            <div class="d-flex gap-3">
              <div class="posey-icon-box fs-4">🤝</div>
              <div>
                <h5 class="fw-semibold mb-2">Confiance &amp; qualité</h5>
                <p class="posey-text-muted mb-0">Garantir des services de qualité grâce à la notation et la vérification.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-alt py-5">
      <div class="posey-container">
        <div class="text-center mb-5">
          <h2 class="posey-section-title">KOFCORPORATION</h2>
        </div>
        <div class="row align-items-center g-5">
          <div class="col-md-6">
            <h4 class="posey-text-primary fw-semibold mb-3">Notre histoire</h4>
            <p class="posey-text-muted">
              KofCorporation (SARLU) créée en 2022, exerce dans la prestation de services IT :
              sites web, applications mobiles, logiciels de gestion, assistance informatique et formation.
            </p>
            <p class="mb-4">
              Dirigée par <strong>Omar Farouk KOUGBADA</strong>, notre équipe donne vie à vos projets avec passion.
            </p>
            <h4 class="posey-text-primary fw-semibold mb-3">Nos services</h4>
            <ul class="list-unstyled posey-text-muted">
              <li class="mb-2"><i class="fas fa-check posey-text-primary me-2"></i>Création de sites web vitrines et e-commerce</li>
              <li class="mb-2"><i class="fas fa-check posey-text-primary me-2"></i>Développement d'applications mobiles</li>
              <li class="mb-2"><i class="fas fa-check posey-text-primary me-2"></i>Conception de logiciels de gestion</li>
              <li class="mb-2"><i class="fas fa-check posey-text-primary me-2"></i>Assistance informatique et infrastructure IT</li>
              <li class="mb-2"><i class="fas fa-check posey-text-primary me-2"></i>Formation en informatique</li>
            </ul>
          </div>
          <div class="col-md-6">
            <img src="/img/tech3.png" alt="KOFCORPORATION" class="img-fluid rounded-3 border" style="border-color: var(--posey-border) !important;" />
          </div>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="posey-container">
        <div class="text-center mb-5">
          <h2 class="posey-section-title">Nos valeurs</h2>
          <p class="posey-section-subtitle">Les principes qui guident notre action</p>
        </div>
        <div class="row g-4">
          <div class="col-md-4" v-for="value in values" :key="value.title">
            <div class="feature-card">
              <div class="feature-icon">{{ value.icon }}</div>
              <h5 class="fw-semibold mb-3">{{ value.title }}</h5>
              <p class="posey-text-muted mb-0">{{ value.text }}</p>
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
  name: 'AboutPage',
  components: { DefaultLayout },
  data() {
    return {
      values: [
        { icon: '💡', title: 'Innovation', text: 'Des solutions technologiques innovantes pour répondre aux besoins actuels.' },
        { icon: '🎯', title: 'Excellence', text: 'Des services de la plus haute qualité pour tous nos clients et partenaires.' },
        { icon: '🤝', title: 'Confiance', text: 'Des relations durables basées sur la transparence et l\'intégrité.' },
      ],
    }
  },
}
</script>
