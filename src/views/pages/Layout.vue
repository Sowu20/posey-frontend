<template>
  <div class="posey-page d-flex flex-column min-vh-100">
    <AppHeader />
    <main class="flex-grow-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '../composants/AppHeader.vue'
import AppFooter from '../composants/AppFooter.vue'

export default {
  components: { AppHeader, AppFooter },
  name: 'DefaultLayout',
}
</script>
