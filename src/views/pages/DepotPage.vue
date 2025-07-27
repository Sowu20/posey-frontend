<template>
  <default-layout>
    <depot-template />
  </default-layout>
</template>

<script>
  import DefaultLayout from './Layout.vue'
  import DepotTemplate from '../templates/DepotTemplate.vue';
  export default {
    name: 'DepotPage',
    components: {
      DefaultLayout,
      DepotTemplate
    },
  }
</script>