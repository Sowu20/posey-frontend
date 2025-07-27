<template>
  <div class="login"></div>
  <LoginTemplate />
</template>

<script>
  import LoginTemplate from '../templates/LoginTemplate.vue';
  export default {
    name: 'LoginPage',
    components: {
      LoginTemplate,
    },
  }
</script>