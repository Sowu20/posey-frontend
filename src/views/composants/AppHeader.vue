<template>
  <header class="posey-header">
    <div class="container-fluid px-4">
      <div class="d-flex justify-content-between align-items-center py-3">
        <router-link to="/" class="d-flex align-items-center text-decoration-none">
          <div class="posey-logo-icon me-2">P</div>
          <span class="fw-bold fs-5 text-white">POSEY</span>
          <span class="ms-2 posey-text-muted small d-none d-sm-inline">by KOFCORPORATION</span>
        </router-link>

        <nav class="d-none d-lg-flex gap-4">
          <router-link to="/" class="nav-link-posey">Accueil</router-link>
          <router-link to="/recherche_prestataire" class="nav-link-posey">Prestataires</router-link>
          <router-link to="/about" class="nav-link-posey">À propos</router-link>
          <router-link to="/contact" class="nav-link-posey">Contact</router-link>
        </nav>

        <div class="d-flex gap-2 align-items-center" v-if="isLoggedIn">
          <div class="position-relative me-2" @click="toggleNotifications" style="cursor: pointer;">
            <i class="bi bi-bell fs-5"></i>
            <span v-if="unreadCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ unreadCount }}
            </span>
          </div>

          <div v-if="showNotifications" class="notification-dropdown posey-card p-3 shadow">
            <h6 class="mb-3">Notifications</h6>
            <div v-if="notifications.length">
              <div
                v-for="notif in notifications"
                :key="notif.id"
                class="notification-item d-flex justify-content-between align-items-start py-2"
                :class="{ 'fw-semibold': !notif.is_read }"
              >
                <span @click="openNotification(notif)" style="cursor: pointer;">{{ notif.message }}</span>
                <i class="bi bi-x text-danger ms-2" style="cursor: pointer;" @click.stop="deleteNotification(notif.id)"></i>
              </div>
            </div>
            <div v-else class="posey-text-muted small">Aucune notification</div>
          </div>

          <router-link to="/profil" class="d-flex align-items-center text-decoration-none text-white">
            <img src="/img/default-avatar.png" alt="avatar" class="rounded-circle" width="36" height="36" />
            <span class="ms-2 d-none d-md-inline">{{ userData.username }}</span>
          </router-link>
          <button class="posey-btn-outline btn-sm py-1 px-3" @click="logout">Déconnexion</button>
        </div>

        <div class="d-flex gap-2" v-else>
          <router-link to="/login" class="posey-btn-outline btn-sm py-2 px-3 text-decoration-none">Connexion</router-link>
          <router-link to="/register" class="posey-btn-primary btn-sm py-2 px-3 text-decoration-none">Inscription</router-link>
        </div>
      </div>
    </div>

    <div v-if="lastNotification" class="toast-notification posey-card px-3 py-2">
      {{ lastNotification.message }}
    </div>
  </header>
</template>

<script>
  import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
  import { useRouter } from 'vue-router'
  import api from '../services/api'

  export default {
    name: 'AppHeader',
    setup() {
      const isLoggedIn = ref(false)
      const router = useRouter()
      const userData = ref({})
      const notifications = ref([])
      const lastNotification = ref(false)
      const showNotifications = ref(false)
      let interval = null
      let socket = null
      let hideTimer = null
      let firstFetchDone = false

      const unreadCount = computed(() => notifications.value.filter(n => !n.is_read).length)

      const showNotification = (message) => {
        if (lastNotification.value) return
        lastNotification.value = { message }
        hideTimer = setTimeout(() => { lastNotification.value = null }, 3000)
      }

      const fetchNotifications = async () => {
        try {
          const user = JSON.parse(localStorage.getItem('auth_user_data'))
          if (!user?.id || !user?.access) return
          const res = await api.get('prestation/notifications/', {
            headers: { Authorization: `Bearer ${user.access}` }
          })
          notifications.value = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          if (!firstFetchDone) {
            const lastUnread = notifications.value.find(n => !n.is_read)
            if (lastUnread) showNotification(lastUnread.message)
            firstFetchDone = true
          }
        } catch (err) {
          console.error('Erreur notifications :', err)
        }
      }

      const toggleNotifications = () => { showNotifications.value = !showNotifications.value }
      const openNotification = async (notif) => {
        if (!notif.is_read) {
          try {
            const user = JSON.parse(localStorage.getItem('auth_user_data'))
            if (!user?.access) return
            await api.post(`prestation/notifications/lue/${notif.id}/`, {}, {
              headers: { Authorization: `Bearer ${user.access}` }
            })
            notif.is_read = true
          } catch (error) {
            console.error('Erreur notification', error)
          }
        }
      }

      const deleteNotification = async (id) => {
        try {
          const user = JSON.parse(localStorage.getItem('auth_user_data'))
          if (!user?.access) return
          await api.delete(`prestation/notifications/supprimer/${id}/`, {
            headers: { Authorization: `Bearer ${user.access}` }
          })
        } catch (err) {
          console.error('Erreur suppression notification :', err)
        }
      }

      const logout = () => {
        localStorage.removeItem('auth_user_data')
        isLoggedIn.value = false
        userData.value = {}
        router.push('/login')
      }

      const initWebSocket = () => {
        const user = JSON.parse(localStorage.getItem('auth_user_data'))
        if (!user?.id) return
        socket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/${user.id}/`)
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data)
          if (data.notification) {
            notifications.value.unshift({
              id: Date.now(),
              message: data.notification,
              timestamp: new Date().toISOString(),
              is_read: false
            })
            showNotification(data.notification)
          }
        }
        socket.onclose = () => setTimeout(initWebSocket, 5000)
      }

      onMounted(() => {
        const user = localStorage.getItem('auth_user_data')
        if (user) {
          isLoggedIn.value = true
          userData.value = JSON.parse(user)
          fetchNotifications()
          interval = setInterval(fetchNotifications, 5000)
          initWebSocket()
        }
      })

      onBeforeUnmount(() => {
        clearInterval(interval)
        clearTimeout(hideTimer)
        if (socket) socket.close()
      })

      return { isLoggedIn, userData, logout, notifications, showNotifications, toggleNotifications, lastNotification, openNotification, unreadCount, deleteNotification }
    }
  }
</script>

<style scoped>
.posey-header {
  background: rgba(11, 17, 32, 0.95);
  border-bottom: 1px solid var(--posey-border);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

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
  color: #fff;
}

.nav-link-posey {
  color: var(--posey-text-muted);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s;
}

.nav-link-posey:hover,
.nav-link-posey.router-link-active {
  color: var(--posey-text);
}

.notification-dropdown {
  position: absolute;
  right: 1rem;
  top: 64px;
  min-width: 300px;
  max-height: 320px;
  overflow-y: auto;
  z-index: 1100;
}

.notification-item {
  border-bottom: 1px solid var(--posey-border);
  font-size: 0.875rem;
}

.toast-notification {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 2000;
  animation: fadeInOut 3s ease forwards;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-10px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-10px); }
}
</style>
