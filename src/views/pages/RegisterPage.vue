<template>
  <div class="register-page"></div>
  <RegisterTemplate />
</template>

<script>
  import RegisterTemplate from '../templates/RegisterTemplate.vue';
  export default {
    name: 'RegisterPage',
    components: {
      RegisterTemplate,
    },
  }
</script>