import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/pages/HomePage.vue'
import AboutPage from '@/views/pages/AboutPage.vue'
import LoginPage from '@/views/pages/LoginPage.vue'
import RegisterPage from '@/views/pages/RegisterPage.vue'
import ContactPage from '@/views/pages/ContactPage.vue'
import RecherchePrestatairePage from '@/views/pages/RecherchePrestatairePage.vue'
import SingleUserPage from '@/views/pages/SingleUserPage.vue'
import DashboardClientPage from '@/views/pages/DashboardClientPage.vue'
import ShowProviderPage from '@/views/pages/ShowProviderPage.vue'
import DepotPage from '@/views/pages/DepotPage.vue'
import OrderPage from '@/views/pages/OrderPage.vue'
import ListOrdersPage from '@/views/pages/ListOrdersPage.vue'
import DashboardProviderPage from '@/views/pages/DashboardProviderPage.vue'
import DashboardAdminPage from '@/views/pages/DashboardAdminPage.vue'
import ForgotPasswordPage from '@/views/pages/ForgotPasswordPage.vue'
import ResetPasswordPage from '@/views/pages/ResetPasswordPage.vue'
import Swal from 'sweetalert2'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: { requiredAuth: false },
  },
  {
    path: '/about',
    name: 'about',
    component: AboutPage,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage,
  },
  {
    path: '/profil',
    name: 'profil',
    component: SingleUserPage,
    meta: { requiredAuth: true },
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactPage,
  },
  {
    path: '/recherche_prestataire',
    name: 'recherche_prestataire',
    component: RecherchePrestatairePage,
  },
  {
    path: '/prestataire/:id',
    name: 'prestataire',
    component: ShowProviderPage,
  },
  {
    path: '/commandes',
    name: 'commandes',
    component: OrderPage,
  },
  {
    path: '/dashboard_client',
    name: 'dashboard_client',
    component: DashboardClientPage,
    meta: { requiredAuth: true },
  },
  {
    path: '/depot',
    name: 'depot',
    component: DepotPage,
  },
  {
    path: '/commande',
    name: 'commande',
    component: OrderPage,
  },
  {
    path: '/list_commandes',
    name: 'list_commandes',
    component: ListOrdersPage,
  },
  {
    name: 'dashboard_provider',
    path: '/dashboard_provider',
    component: DashboardProviderPage,
    meta: { requiredAuth: true },
  },
  {
    name: 'dashboard_admin',
    path: '/dashboard_admin',
    component: DashboardAdminPage,
    meta: { requiredAuth: true },
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('auth_user_data'))
      if (user && user.role === 'admin') {
        next()
      } else {
        Swal.fire({
          icon: 'error',
          title: '⛔ Accès refusé',
          text: "Vous n'avez pas les droits pour accéder à cette page.",
          confirmButtonText: 'Retour à l’accueil',
          confirmButtonColor: '#3085d6',
          allowOutsideClick: false
        }).then(() => {
          next('/')
        })
      }
    }
  },
  {
    name: 'forgot_password',
    path: '/forgot_password',
    component: ForgotPasswordPage,
  },
  {
    name: 'reset_password',
    path: '/reset_password/:uid/:token',
    component: ResetPasswordPage
    // props: true
  }
]

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth_user_data')
  if (to.meta.requiredAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
