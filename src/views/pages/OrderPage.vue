<template>
  <default-layout>
    <order-template />
  </default-layout>
</template>

<script>
  import DefaultLayout from './Layout.vue'
  import OrderTemplate from '../templates/OrderTemplate.vue';
  export default {
    name: 'OrderPage',
    components: {
      DefaultLayout,
      OrderTemplate
    },
  }
</script>