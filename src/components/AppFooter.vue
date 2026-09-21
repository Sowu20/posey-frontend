<template>
  <footer class="posey-footer mt-auto">
    <div class="container py-5">
      <div class="row g-4">
        <div class="col-md-4">
          <h5 class="fw-bold mb-3">POSEY</h5>
          <p class="posey-text-muted small mb-0">Nous donnons vie à vos projets en vous connectant aux meilleurs prestataires.</p>
        </div>
        <div class="col-6 col-md-2">
          <h6 class="fw-semibold mb-3 text-uppercase small">À propos</h6>
          <ul class="list-unstyled">
            <li><router-link to="/about" class="footer-link">Qui sommes-nous</router-link></li>
            <li><router-link to="/contact" class="footer-link">Contact</router-link></li>
          </ul>
        </div>
        <div class="col-6 col-md-2">
          <h6 class="fw-semibold mb-3 text-uppercase small">Support</h6>
          <ul class="list-unstyled">
            <li><router-link to="/contact" class="footer-link">Centre d'aide</router-link></li>
            <li><a href="#" class="footer-link">FAQ</a></li>
          </ul>
        </div>
        <div class="col-md-4">
          <h6 class="fw-semibold mb-3 text-uppercase small">Nous trouver</h6>
          <p class="posey-text-muted small mb-1">Agoè Cacaveli Bluezone</p>
          <p class="posey-text-muted small mb-1">+228 93 55 47 40</p>
          <p class="posey-text-muted small">contact@kofcorporation.com</p>
        </div>
      </div>
      <hr class="my-4" />
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

<style scoped src="../styles/components/app-footer.css"></style>
