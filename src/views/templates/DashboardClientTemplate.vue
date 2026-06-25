<template>
  <dashboard-layout>
    <dashboard-sidebar
      subtitle="Espace Client"
      :items="navItems"
      :active-view="currentView"
      @navigate="currentView = $event"
    />

    <div class="dashboard-main">
      <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h2 class="fw-bold mb-1">Bonjour, {{ client.prenom }} {{ client.nom }} !</h2>
          <p class="posey-text-muted mb-0">Voici un aperçu de vos activités récentes.</p>
        </div>
        <button class="posey-btn-primary" @click="currentView = 'commandeForm'">
          <i class="fas fa-plus me-2"></i>Nouvelle demande
        </button>
      </div>

      <component :is="currentViewComponent" v-bind="componentProps" @depot="depot" />
    </div>
  </dashboard-layout>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import api from '../services/api'
import DashboardLayout from '../pages/DashboardLayout.vue'
import DashboardSidebar from '../composants/DashboardSidebar.vue'
import ClientOverView from '../composants/ClientOverView.vue'
import ClientDepot from '../composants/ClientDepot.vue'
import ClientCommade from '../composants/ClientCommade.vue'
import CleintPrestation from '../composants/CleintPrestation.vue'
import ClientTransaction from '../composants/ClientTransaction.vue'
import ClientPrestationsStatus from '../composants/ClientPrestationsStatus.vue'

export default {
  name: 'DashboardClientTemplate',
  components: {
    DashboardLayout,
    DashboardSidebar,
    ClientOverView,
    ClientDepot,
    ClientCommade,
    CleintPrestation,
    ClientTransaction,
    ClientPrestationsStatus,
  },
  setup() {
    const currentView = ref('overview')

    const navItems = [
      { id: 'overview', label: 'Tableau de bord', icon: 'fas fa-th-large' },
      { id: 'prestationsStatus', label: 'Mes demandes', icon: 'fas fa-briefcase' },
      { id: 'commandes', label: 'Mes commandes', icon: 'fas fa-shopping-bag' },
      { id: 'depot', label: 'Paiements', icon: 'fas fa-credit-card' },
      { id: 'commandeForm', label: 'Nouvelle demande', icon: 'fas fa-plus-circle' },
    ]

    const client = reactive({ nom: '', prenom: '', email: '', image: '', quartier: '', ville: '' })
    const commandes = reactive({ totalcommande: 0, commandetermine: 0, solde: 0 })
    const montant = ref(0)
    const listeTransactions = ref([])
    const listeCommandes = ref([])
    const loadingCommandes = ref(false)
    const categories = ref([])
    const prestataires = ref([])
    const note = ref(null)
    const selectedQuartier = ref('')
    const selectedVille = ref('')
    const selectedCategorie = ref('')
    const filteredPrestataires = ref([])

    const currentViewComponent = computed(() => {
      const map = {
        overview: ClientOverView,
        depot: ClientDepot,
        commandes: ClientCommade,
        commandeForm: CleintPrestation,
        transactions: ClientTransaction,
        prestationsStatus: ClientPrestationsStatus,
      }
      return map[currentView.value] || ClientOverView
    })

    const filtrerPrestataires = () => {
      let resultat = prestataires.value.slice()
      if (selectedCategorie.value) resultat = resultat.filter(p => p.categorie === selectedCategorie.value)
      if (selectedQuartier.value) resultat = resultat.filter(p => p.quartier?.toLowerCase().includes(selectedQuartier.value.toLowerCase()))
      if (selectedVille.value) resultat = resultat.filter(p => p.ville?.toLowerCase().includes(selectedVille.value.toLowerCase()))
      filteredPrestataires.value = resultat
    }

    const resetFiltres = () => {
      selectedCategorie.value = ''
      selectedQuartier.value = ''
      selectedVille.value = ''
      filteredPrestataires.value = []
    }

    const componentProps = computed(() => ({
      statsCards: [
        { label: 'Commandes totales', value: commandes.totalcommande },
        { label: 'Commandes terminées', value: commandes.commandetermine },
        { label: 'Solde portefeuille', value: `${commandes.solde} FCFA` },
      ],
      commandes: listeCommandes.value,
      montant: montant.value,
      transactions: listeTransactions.value,
      loading: loadingCommandes.value,
      categories: categories.value,
      prestataires: filteredPrestataires.value,
      selectedCategorie,
      selectedQuartier,
      selectedVille,
      filtrerPrestataires,
      resetFiltres,
      note,
    }))

    const depot = (moyen) => {
      alert(`Dépôt de ${montant.value} FCFA via ${moyen}`)
    }

    onMounted(async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('auth_user_data'))
        if (!userData?.id) throw new Error('Utilisateur non connecté.')
        const id = userData.id

        const [
          userResponse, balanceResponse, listorderResponse,
          statutorderResponse, transactionlistResponse, categoryResponse,
          prestatairesResponse, notesResponse,
        ] = await Promise.all([
          api.get(`user/${id}`),
          api.get(`portefeuille/solde/${id}/`),
          api.get(`commande/client/${id}/`),
          api.get(`commande/statut/${id}/`),
          api.get(`portefeuille/transactions/${id}/`),
          api.get('prestation/detail_categorie/'),
          api.get('user/prestataires/'),
          api.get(`/note/prestataire-note/${id}/`),
        ])

        Object.assign(client, userResponse.data)
        commandes.solde = balanceResponse.data.solde
        commandes.totalcommande = listorderResponse.data.length
        commandes.commandetermine = statutorderResponse.data.statuts.filter(s => s === 'termine').length
        listeCommandes.value = listorderResponse.data
        listeTransactions.value = transactionlistResponse.data
        categories.value = categoryResponse.data
        prestataires.value = prestatairesResponse.data
        note.value = Math.round(notesResponse.data.moyenne_score || 0)
        filtrerPrestataires()
      } catch (error) {
        console.error('Erreur chargement des données client:', error)
      }
    })

    return { client, currentView, currentViewComponent, componentProps, depot, navItems }
  },
}
</script>
