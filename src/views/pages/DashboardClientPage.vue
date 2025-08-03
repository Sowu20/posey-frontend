<template>
  <default-layout>
    <dashboard-client-template />
  </default-layout>
</template>

<script>
  import DefaultLayout from './Layout.vue';
  import DashboardClientTemplate from '../templates/DashboardClientTemplate.vue';

  export default {
    name: 'DashboardClientPage',
    components: {
      DefaultLayout,
      DashboardClientTemplate
    },
  }
</script>