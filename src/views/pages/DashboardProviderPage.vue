<template>
  <DefaultLayout>
    <DashboardProviderTemplate />
  </DefaultLayout>
</template>

<script>
  import DefaultLayout from '../pages/Layout.vue'
  import DashboardProviderTemplate from '../templates/DashboardProviderTemplate.vue';
  export default {
    name: 'DashboardProviderPage',
    components: {
      DefaultLayout,
      DashboardProviderTemplate
    },
  }
</script>