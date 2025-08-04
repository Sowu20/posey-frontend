<template>
  <div>
  <AppHeader />
      <main class="flex-shrink-0">
          <div class="container">
              <slot />
          </div>
      </main>
  <AppFooter />
</div>
</template>

<script>
  import AppHeader from '../composants/AppHeader.vue';
  import AppFooter from '../composants/AppFooter.vue';
  export default {
      components: {
          AppHeader,
          AppFooter
      },
      name: 'DefaultLayout',
  }
</script>

<style>
  main > .container {
    padding: 60px 15px 0;
    margin: 0;
  }
</style>