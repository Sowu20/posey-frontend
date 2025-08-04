<template>
  <div>
  <AppHeader />
      <main class="flex-shrink-0">
          <div class="container-fluid">
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
    padding: 15px 0;
  }
</style>