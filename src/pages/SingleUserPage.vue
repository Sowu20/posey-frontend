<template>
  <default-layout>
    <single-user-template />
  </default-layout>
</template>

<script>
  import SingleUserTemplate from '@/templates/SingleUserTemplate.vue';
  import DefaultLayout from '@/layouts/Layout.vue';
  export default {
    name: 'SingleUserPage',
    components: {
      SingleUserTemplate,
      DefaultLayout
    },
  }
</script>