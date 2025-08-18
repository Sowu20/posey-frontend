<template>
  <header class="bg-white shadow-sm border-bottom position-relative">
    <div class="container-fluid">
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
            <!-- <span v-if="notifications.length" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ notifications.length }}
            </span> -->
            <span v-if="unreadCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {{ unreadCount }}
            </span>
          </div>

          <!-- Menu notifications -->
          <div v-if="showNotifications" class="dropdown-menu show p-3 shadow rounded" style="position: absolute; right: 20px; top: 70px; min-width: 300px; z-index: 999;">
            <h6 class="dropdown-header">Notifications</h6>
            <div v-if="notifications.length">
              <div v-for="notif in notifications" :key="notif.id" class="dropdown-item d-flex justify-content-between align-items-center text-wrap" :class="{ 'fw-bold': !notif.is_read }">
                <span @click="openNotification(notif)" style="cursor: pointer;">
                  {{ notif.message }}
                </span>
                <i class="bi bi-x text-danger ms-2" style="cursor: pointer;" @click.stop="deleteNotification(notif.id)"></i>
              </div>
            </div>
            <div v-else class="dropdown-item text-muted">Aucune notification</div>
          </div>

          <!-- Popup notification -->
          <div v-if="activeNotification" class="notification-popup-overlay" @click.self="closeNotification">
            <div class="notification-popup shadow rounded p-3 bg-white">
              <h5>Notification</h5>
              <p>{{ activeNotification.message }}</p>
              <button class="btn btn-primary" @click="closeNotification">Fermer</button>
            </div>
          </div>

          <!-- Voir la dernière notif -->
          <div v-if="lastNotification" class="toast-notification shadow rounded px-3 py-2">
            {{ lastNotification.message }}
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
      const activeNotification = ref(null)
      let interval = null
      let socket = null
      let hideTimer = null
      let firstFetchDone = false

      const formatImage = (imagePath) => {
        if (!imagePath) return '/img/default-avatar.png'
        if (imagePath.startsWith('http')) return imagePath
        return `http://127.0.0.1:8000${imagePath}`
      }

      const unreadCount = computed(() => {
        return notifications.value.filter(n => !n.is_read).length
      })

      const showNotification = (message) => {
        lastNotification.value = { message }
        clearTimeout(hideTimer)
        hideTimer = setTimeout(() => {
          lastNotification.value = null
        }, 3000)
      }

      const fetchNotifications = async () => {
        try {
          const user = JSON.parse(localStorage.getItem('auth_user_data'))
          if (!user?.id || !user?.access) return

          // On utilise le token dans l'en-tête Authorization
          const res = await api.get(`prestation/notifications/`, {
            headers: { Authorization: `Bearer ${user.access}` }
          })
          notifications.value = res.data.sort((a, b) => {
            return new Date(b.timestamp) -new Date(a.timestamp)
          })

          if (res.data.length) {
            showNotification(res.data[0].message)
          }
          if (!firstFetchDone) {
            const lastUnread = notifications.value.find(n => !n.is_read)
            if (lastUnread) showNotification(lastUnread.message)
            firstFetchDone = true
          }
        } catch (err) {
          console.error("Erreur notifications :", err)
        }
      }

      const markAsRead = async (notifId) => {
        try {
          const user = JSON.parse(localStorage.getItem('auth_user_data'))
          if (!user?.access) return

          await api.post(`prestation/notifications/lue/${notifId}/`, {}, {
            headers: { Authorization: `Bearer ${user.access}` }
          })

          // Met à jour localement l'état
          const notif = notifications.value.find(n => n.id === notifId)
          if (notif) notif.is_read = true
        } catch (err) {
          console.error("Erreur marquage notification :", err)
        }
      }

      const toggleNotifications = () => {
        showNotifications.value = !showNotifications.value
      }

      const openNotification = async (notif) => {
        if(!notif.is_read) {
          try {
            const user = JSON.parse(localStorage.getItem('auth_user_data'))
            if (!user?.access) return
            await api.post(`prestation/notifications/lue/${notif.id}/`, {}, {
              headers: { Authorization: `Bearer ${user.access}` }
            })
            notif.is_read = true
          } catch (error) {
            console.log("Erreur de notification", error)
          }
        }
        activeNotification.value = notif
      }

      const closeNotification = () => {
        activeNotification.value = null
      }

      const deleteNotification = async (id) => {
        try {
          const user = JSON.parse(localStorage.getItem('auth_user_data'))
          if (!user?.access) return

          await api.delete(`prestation/notifications/supprimer/${id}/`, {
            headers: { Authorization: `Bearer ${user.access}` }
          })
        } catch (err) {
          console.error("Erreur suppression notification :", err)
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
        if (!user?.id || !user?.access) return

        // Remplace l'URL selon ton environnement
        socket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/${user.id}/`)

        socket.onopen = () => {
          console.log("WebSocket connecté")
        }

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data)
          console.log("Notification reçue: ", data)
          if (data.notification) {
            notifications.value.unshift({
              id: Date.now(),
              message: data.notification,
              timestamp: new Date().toISOString(),
              is_read: false
            })

            notifications.value.sort((a, b) => {
              return new Date(b.timestamp) - new Date(a.timestamp)
            })

            showNotification(data.notification)
          }
        }

        socket.onclose = () => {
          console.log("WebSocket déconnecté, reconnexion ...")
          setTimeout(initWebSocket, 5000)
        }

        socket.onerror = (err) => {
          console.error("Erreur WebSocket :", err)
        }
      }

      onMounted(() => {
        const user = localStorage.getItem('auth_user_data')
        if (user) {
          isLoggedIn.value = true
          userData.value = JSON.parse(user)
          fetchNotifications()
          interval = setInterval(fetchNotifications, 60000)
          initWebSocket()
        }
      })

      onBeforeUnmount(() => {
        clearInterval(interval)
        clearTimeout(hideTimer)
        if (socket) {
          socket.close()
        }
      })

      return { isLoggedIn, userData, logout, notifications, showNotifications, formatImage, toggleNotifications, lastNotification, markAsRead, openNotification, closeNotification, activeNotification, unreadCount, deleteNotification }
    }
  }
</script>

<style scoped>
  .dropdown-menu {
    max-height: 300px;
    overflow-y: auto;
  }
  .toast-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #fff;
    z-index: 2000;
    animation: fadeInOut 3s ease forwards;
  }
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-10px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; }
    100% { opacity: 0; transform: translateY(-10px); }
  }
  .notification-popup-overlay {
    position: fixed;
    top: 0;
    right: 0;
    width: 350px;
    height: 100%;
    background: #fff;
    box-shadow: -2px 0 8px rgba(0,0,0,0.2);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 3000;
  }
  .notification-popup-overlay.show {
    transform: translateX(0);
  }
  .notification-popup {
    padding: 20px;
    overflow-y: auto;
    height: 100%;
  }
</style>