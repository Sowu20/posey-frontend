<template>
  <header class="bg-white shadow-sm border-bottom position-relative">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center py-3">
        <!-- Logo + slogan -->
        <div class="d-flex align-items-center">
          <h1 class="h4 fw-bold text-primary mb-0">POSEY</h1>
          <span class="ms-2 text-muted small">by KOFCORPORATION</span>
        </div>

        <!-- Menu navigation -->
        <div class="d-none d-md-flex gap-3">
          <a href="/" class="text-dark text-decoration-none">Accueil</a>
          <a href="/about" class="text-dark text-decoration-none">A Propos</a>
          <a href="/contact" class="text-dark text-decoration-none">Contactez-Nous</a>
        </div>

        <!-- Boutons selon login -->
        <div class="d-flex gap-3 align-items-center" v-if="isLoggedIn">
          <!-- Avatar -->
          <router-link to="/profil" class="d-flex align-items-center text-decoration-none">
            <img src="/img/default-avatar.png" alt="image" class="rounded-circle" width="40" height="40"/>
            <span class="ms-2 text-dark">{{ userData.username }}</span>
          </router-link>
          <span class="btn text-danger cursor-pointer ms-3 fw-semibold" @click="logout">
            Se Déconnecter
          </span>
          <!-- Cloche de notification -->
          <div class="position-relative me-3" @click="toggleNotifications" style="cursor: pointer;">
            <i class="bi bi-bell fs-5 text-dark"></i>
            <span v-if="notifications.length" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ notifications.length }}
            </span>
          </div>

          <!-- Menu notifications -->
          <div v-if="showNotifications" class="dropdown-menu show p-3 shadow rounded" style="position: absolute; right: 20px; top: 70px; min-width: 300px; z-index: 999;">
            <h6 class="dropdown-header">Notifications</h6>
            <div v-if="notifications.length">
              <div v-for="notif in notifications" :key="notif.id" class="dropdown-item text-wrap">
                🔔 {{ notif.message }}
              </div>
            </div>
            <div v-else class="dropdown-item text-muted">Aucune notification</div>
          </div>
        </div>

        <div class="d-flex gap-2" v-else>
          <a href="/login" class="btn text-primary">Connexion</a>
          <a href="/register" class="btn btn-primary">Inscription</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { useRouter } from 'vue-router'
  // import api from '../services/api'

  export default {
    name: 'AppHeader',
    setup() {
      const isLoggedIn = ref(false)
      const router = useRouter()
      const userData = ref({})
      const notifications = ref([])
      const showNotifications = ref(false)
      let interval = null

      const formatImage = (imagePath) => {
        if (!imagePath) return '/img/default-avatar.png'
        if (imagePath.startsWith('http')) return imagePath
        return `http://127.0.0.1:8000${imagePath}`
      }

      // const fetchNotifications = async () => {
      //   try {
      //     const user = JSON.parse(localStorage.getItem('auth_user_data'))
      //     if (!user?.id) return

      //     const res = await api.get(`prestation/notifications/${user.id}`)
      //     notifications.value = res.data
      //   } catch (err) {
      //     console.error("Erreur notifications :", err)
      //   }
      // }

      // const toggleNotifications = () => {
      //   showNotifications.value = !showNotifications.value
      // }

      const logout = () => {
        localStorage.removeItem('auth_user_data')
        isLoggedIn.value = false
        userData.value = {}
        router.push('/login')
      }

      onMounted(() => {
        const user = localStorage.getItem('auth_user_data')
        if (user) {
          isLoggedIn.value = true
          userData.value = JSON.parse(user)
          // fetchNotifications()
          // interval = setInterval(fetchNotifications, 60000) // toutes les 60 secondes
        }
      })

      onBeforeUnmount(() => {
        clearInterval(interval)
      })

      return { isLoggedIn, userData, logout, notifications, showNotifications, formatImage }
    }
  }
</script>

<style scoped>
  .dropdown-menu {
    max-height: 300px;
    overflow-y: auto;
  }
</style>