<template>
  <aside class="dashboard-sidebar">
    <div class="mb-4 px-2">
      <div class="d-flex align-items-center gap-2 mb-1">
        <div class="posey-logo-icon">P</div>
        <span class="fw-bold fs-5">POSEY</span>
      </div>
      <small class="posey-text-muted">{{ subtitle }}</small>
    </div>

    <nav class="flex-grow-1 d-flex flex-column gap-1">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        class="dashboard-nav-item"
        :class="{ active: activeView === item.id }"
        @click="$emit('navigate', item.id)"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
        <span v-if="item.badge" class="ms-auto posey-badge posey-badge-danger">{{ item.badge }}</span>
      </button>
    </nav>

    <div class="mt-4 pt-3 border-top" style="border-color: var(--posey-border) !important;">
      <button type="button" class="dashboard-nav-item text-danger" @click="logout">
        <i class="fas fa-sign-out-alt"></i>
        <span>Déconnexion</span>
      </button>
    </div>
  </aside>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'DashboardSidebar',
  props: {
    items: { type: Array, required: true },
    activeView: { type: String, required: true },
    subtitle: { type: String, default: '' },
  },
  emits: ['navigate'],
  setup() {
    const router = useRouter()
    const logout = () => {
      localStorage.removeItem('auth_user_data')
      router.push('/login')
    }
    return { logout }
  },
}
</script>

<style scoped>
.posey-logo-icon {
  width: 32px;
  height: 32px;
  background: var(--posey-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
}
</style>
