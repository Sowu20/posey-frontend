<template>
  <default-layout>
    <forgot-password-template />
  </default-layout>
</template>

<script>
  import DefaultLayout from './Layout.vue';
  import ForgotPasswordTemplate from '../templates/ForgotPasswordTemplate.vue';
  export default {
    name: 'ForgotPasswordPage',
    components: {
      DefaultLayout,
      ForgotPasswordTemplate
    },
  }
</script>
