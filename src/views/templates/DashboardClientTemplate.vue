<template>
  <div class="min-vh-100 bg-light py-5">
    <div class="container">
      <!-- Profil centré -->
      <div class="text-center mb-5">
        <img src="/img/default-avatar.png" class="rounded-circle mb-3 border" width="100" height="100" />
        <h4 class="fw-bold mb-0">{{ client.prenom }} {{ client.nom }}</h4>
        <p class="text-muted">{{ client.email }}</p>
      </div>

      <!-- Navigation onglets -->
      <div class="d-flex justify-content-center gap-3 mb-4 flex-wrap">
        <button class="btn" :class="getTabClass('overview')" @click="currentView = 'overview'">Vue d'ensemble</button>
        <button class="btn" :class="getTabClass('depot')" @click="currentView = 'depot'">Dépôt</button>
        <button class="btn" :class="getTabClass('commandes')" @click="currentView = 'commandes'">Mes commandes</button>
        <button class="btn" :class="getTabClass('prestations')" @click="currentView = 'prestations'">Faire une commande</button>
        <button class="btn" :class="getTabClass('commandeForm')" @click="currentView = 'commandeForm'">Demande de prestation</button>
        <!-- <button class="btn" :class="getTabClass('transactions')" @click="currentView = 'transactions'">Transactions</button> -->
        <button class="btn" :class="getTabClass('prestationsStatus')" @click="currentView = 'prestationsStatus'">Mes demandes de prestation</button>
      </div>

      <!-- Contenu dynamique -->
      <component :is="currentViewComponent" v-bind="componentProps" @depot="depot" />
    </div>
  </div>
</template>

<script>
  import { ref, reactive, onMounted, computed } from 'vue'
  import api from '../services/api'

  // Composants dynamiques
  import ClientOverView from '../composants/ClientOverView.vue'
  import ClientDepot from '../composants/ClientDepot.vue'
  import ClientCommade from '../composants/ClientCommade.vue'
  import CleintPrestation from '../composants/CleintPrestation.vue'
  import ClientTransaction from '../composants/ClientTransaction.vue'
  import ClientPrestationsStatus from '../composants/ClientPrestationsStatus.vue'
  import OrderPrestation from '../composants/OrderPrestation.vue'

  export default {
    name: 'DashboardClientTemplate',
    components: {
      ClientOverView,
      ClientDepot,
      ClientCommade,
      CleintPrestation,
      ClientTransaction,
      ClientPrestationsStatus,
      OrderPrestation
    },
    setup() {
      const currentView = ref('overview')

      const client = reactive({
        nom: '', prenom: '', email: '', image: '', quartier: '', ville: ''
      })

      const commandes = reactive({
        totalcommande: 0,
        commandetermine: 0,
        solde: 0,
      })

      const montant = ref(0)
      const listeTransactions = ref([])
      const listeCommandes = ref([])
      const loadingCommandes = ref(false)
      const categories = ref([])

      const prestataires = ref([])
      const note = ref(null)
      // const notifications = ref([])
      // const prestation = ref([])

      const selectedQuartier = ref('')
      const selectedVille = ref('')
      const selectedCategorie = ref('')
      const filteredPrestataires = ref([])

      const filtrageActif = computed(() =>
        selectedQuartier.value || selectedVille.value || selectedCategorie.value
      )

      const getTabClass = (view) => {
        return currentView.value === view
          ? 'btn-primary text-white'
          : 'btn-outline-primary'
      }

      const currentViewComponent = computed(() => {
        switch (currentView.value) {
          case 'overview': return ClientOverView
          case 'depot': return ClientDepot
          case 'commandes': return ClientCommade
          case 'commandeForm': return CleintPrestation
          case 'transactions': return ClientTransaction
          case 'prestationsStatus': return ClientPrestationsStatus
          case 'prestations': return OrderPrestation
          default: return ClientOverView
        }
      })

      const filtrerPrestataires = () => {
        let resultat = prestataires.value.slice()

        if (selectedCategorie.value) {
          resultat = resultat.filter(p => p.categorie === selectedCategorie.value)
        }
        if (selectedQuartier.value) {
          resultat = resultat.filter(p =>
            p.quartier.toLowerCase().includes(selectedQuartier.value.toLowerCase())
          )
        }
        if (selectedVille.value) {
          resultat = resultat.filter(p =>
            p.ville.toLowerCase().includes(selectedVille.value.toLowerCase())
          )
        }

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
          {
            icon: '📋',
            label: 'Commandes totales',
            value: commandes.totalcommande,
            iconContainer: 'bg-primary bg-opacity-10 p-3 rounded me-3',
          },
          {
            icon: '✅',
            label: 'Commandes terminées',
            value: commandes.commandetermine,
            iconContainer: 'bg-success bg-opacity-10 p-3 rounded me-3',
          },
          {
            icon: '💰',
            label: 'Solde portefeuille',
            value: `${commandes.solde} FCFA`,
            iconContainer: 'bg-warning bg-opacity-10 p-3 rounded me-3',
          },
        ],
        montant: montant.value,
        transactions: listeTransactions.value,
        commandes: listeCommandes.value,
        loading: loadingCommandes.value,
        categories: categories.value,
        prestataires: filteredPrestataires.value,
        selectedCategorie,
        selectedQuartier,
        selectedVille,
        filtrerPrestataires,
        resetFiltres,
        note,
        // prestations: prestation.value,
      }))

      const depot = (moyen) => {
        alert(`Dépôt de ${montant.value} FCFA via ${moyen}`)
      }

      onMounted(async () => {
        try {
          const userData = JSON.parse(localStorage.getItem('auth_user_data'))
          if (!userData || !userData.id) throw new Error("Utilisateur non connecté.")

          const id = userData.id

          const [ userResponse, balanceResponse, listorderResponse, statutorderResponse, transactionlistResponse, categoryResponse, prestatairesResponse, notesResponse ] = await Promise.all([
            api.get(`user/${id}`),
            api.get(`portefeuille/solde/${id}/`),
            api.get(`commande/client/${id}/`),
            api.get(`commande/statut/${id}/`),
            api.get(`portefeuille/transactions/${id}/`),
            api.get(`prestation/detail_categorie/`),
            api.get(`user/prestataires/`),
            api.get(`/note/prestataire-note/${id}/`)
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
          console.error("Erreur chargement des données client:", error)
        }
      })

      return { client, currentView, currentViewComponent, getTabClass, componentProps, depot, filtrageActif }
    }
  }
</script>
