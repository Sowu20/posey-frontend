<template>
  <default-layout>
    <reset-password-template />
  </default-layout>
</template>

<script>
  import DefaultLayout from './Layout.vue';
  import ResetPasswordTemplate from '../templates/ResetPasswordTemplate.vue';
  export default {
    name: 'ResetPasswordPage',
    components: {
      DefaultLayout,
      ResetPasswordTemplate
    },
  }
</script>
