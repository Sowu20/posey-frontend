<template>
  <div class="row g-3">
    <div class="col-md-4" v-for="(item, index) in statsCards" :key="index">
      <div class="bg-white p-4 rounded shadow-sm d-flex align-items-center">
        <div :class="item.iconContainer">
          <span class="fs-4">{{ item.icon }}</span>
        </div>
        <div>
          <p class="text-muted small mb-1">{{ item.label }}</p>
          <h5 class="mb-0">{{ item.value }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ClientOverview',
    props: ['statsCards'],
  }
</script>