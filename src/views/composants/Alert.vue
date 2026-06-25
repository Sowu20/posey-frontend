<template>
  <div class="alert-composant">
    <div
      v-if="success"
      class="posey-alert posey-alert-success d-flex align-items-center gap-2"
      role="alert"
    >
      <i class="fas fa-check-circle"></i>
      <span>{{ message }}</span>
    </div>
    <div v-else class="posey-alert posey-alert-danger d-flex align-items-center gap-2" role="alert">
      <i class="fas fa-exclamation-triangle"></i>
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'alertButton',
  props: {
    message: {
      type: String,
      default: 'Opération effectuée avec succès',
    },
    success: {
      type: Boolean,
      default: true,
    },
  },
}
</script>
