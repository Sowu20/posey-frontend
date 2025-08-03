<template>
  <default-layout>
    <dashboard-admin-template />
  </default-layout>
</template>

<script>
  import DashboardAdminTemplate from '../templates/DashboardAdminTemplate.vue';
  import DefaultLayout from './Layout.vue';

  export default {
    name: 'DashboardAdminPage',
    components: {
      DefaultLayout,
      DashboardAdminTemplate
    }
  }
</script>