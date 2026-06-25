<template>
  <footer class="posey-footer pt-5 pb-4 mt-auto">
    <div class="container-fluid px-4">
      <div class="row g-4">
        <div class="col-md-3">
          <h5 class="fw-bold mb-3">POSEY</h5>
          <p class="posey-text-muted small">
            Nous donnons vie à vos projets en vous connectant aux meilleurs prestataires.
          </p>
        </div>
        <div class="col-md-3">
          <h6 class="fw-semibold mb-3 text-uppercase small">À propos</h6>
          <ul class="list-unstyled">
            <li><router-link to="/about" class="footer-link">Qui sommes-nous</router-link></li>
            <li><router-link to="/contact" class="footer-link">Nous contacter</router-link></li>
          </ul>
        </div>
        <div class="col-md-3">
          <h6 class="fw-semibold mb-3 text-uppercase small">Support</h6>
          <ul class="list-unstyled">
            <li><router-link to="/contact" class="footer-link">Centre d'aide</router-link></li>
            <li><a href="#" class="footer-link">FAQ</a></li>
          </ul>
        </div>
        <div class="col-md-3">
          <h6 class="fw-semibold mb-3 text-uppercase small">Contact</h6>
          <p class="posey-text-muted small mb-1">Agoè Cacaveli Bluezone</p>
          <p class="posey-text-muted small mb-1">+228 93 55 47 40</p>
          <p class="posey-text-muted small">contact@kofcorporation.com</p>
        </div>
      </div>
      <hr class="my-4" style="border-color: var(--posey-border);" />
      <p class="text-center posey-text-muted small mb-0">
        &copy; {{ new Date().getFullYear() }} KOFCORPORATION. Tous droits réservés.
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
}
</script>

<style scoped>
.posey-footer {
  background: var(--posey-bg-card);
  border-top: 1px solid var(--posey-border);
}

.footer-link {
  color: var(--posey-text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  display: block;
  padding: 0.2rem 0;
}

.footer-link:hover {
  color: var(--posey-primary);
}
</style>
