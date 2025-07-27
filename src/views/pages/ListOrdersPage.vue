<template>
  <default-layout>
    <list-orders-template />
  </default-layout>
</template>

<script>
  import DefaultLayout from './Layout.vue'
  import ListOrdersTemplate from '../templates/ListOrdersTemplate.vue';
  export default {
    name: 'ListOrdersPage',
    components: {
      DefaultLayout,
      ListOrdersTemplate
    },
  }
</script>