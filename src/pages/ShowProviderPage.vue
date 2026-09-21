<template>
  <default-layout>
    <show-provider-template />
  </default-layout>
</template>

<script>
  import DefaultLayout from '@/layouts/Layout.vue'
  import ShowProviderTemplate from '@/templates/ShowProviderTemplate.vue';
  export default {
    name: 'ShowProviderPage',
    components: {
      DefaultLayout,
      ShowProviderTemplate,
    },
  }
</script>