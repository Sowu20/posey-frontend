<template>
  <div class="p-4 bg-white rounded shadow-sm">
    <!-- Téléphone -->
    <div class="mb-3">
      <label class="form-label">Numéro de Téléphone</label>
      <input v-model="telephone" type="text" class="form-control" placeholder="Ex: 99 00 00 00" />
    </div>

    <!-- Méthode de paiement -->
    <div class="mb-4">
      <label class="form-label d-block mb-2">Méthode de paiement</label>
      <div class="d-flex gap-3">
        <div class="border rounded p-2 flex-fill text-center cursor-pointer" :class="{ 'border-primary': methode === 'TMONEY' }" @click="methode = 'TMONEY'">
          <img src="/img/mixx_by_yas.png" alt="TMoney" style="height: 40px; width: 40px;" />
          <p class="mt-2 mb-0 fw-semibold">Mixx By Yas</p>
        </div>
        <div class="border rounded p-2 flex-fill text-center cursor-pointer" :class="{ 'border-primary': methode === 'FLOOZ' }" @click="methode = 'FLOOZ'">
          <img src="/img/flooz.png" alt="Flooz" style="height: 40px; width: 40px;" />
          <p class="mt-2 mb-0 fw-semibold">Flooz</p>
        </div>
      </div>
    </div>

    <!-- Montant -->
    <div class="mb-4">
      <label class="form-label">Montant (FCFA)</label>
      <input v-model="localMontant" type="number" class="form-control" placeholder="Ex: 2000" />
    </div>

    <!-- Bouton -->
    <button class="btn btn-primary w-100" @click="faireDepot" :disabled="loading">
      {{ loading ? "Traitement..." : "Faire le dépôt" }}
    </button>
  </div>
</template>

<script>
  import Swal from 'sweetalert2'
  import api from '../services/api'

  export default {
    name: 'ClientDepot',
    props: ['montant'],
    emits: ['depot-effectue'],
    data() {
      return {
        localMontant: this.montant,
        telephone: '',
        methode: '',
        loading: false
      }
    },
    methods: {
      async faireDepot() {
        // Validation des champs
        if (!this.telephone || !this.methode || !this.localMontant) {
          Swal.fire({
            icon: 'warning',
            title: 'Champs manquants',
            text: 'Veuillez remplir tous les champs.',
          })
          return
        }

        // Validation du montant
        if (this.localMontant <= 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Montant invalide',
            text: 'Le montant doit être supérieur à 0.',
          })
          return
        }

        const user = JSON.parse(localStorage.getItem('auth_user_data'))
        if (!user || !user.id) {
          Swal.fire({
            icon: 'error',
            title: 'Utilisateur non connecté',
            text: 'Veuillez vous connecter pour effectuer un dépôt.'
          })
          return
        }

        this.loading = true

        try {
          const response = await api.post('/portefeuille/recharge/', {
            user_id: user.id.toString(),
            phone_number: this.telephone.replace(/\s/g, ''),
            amount: parseFloat(this.localMontant),
            network: this.methode,
            description: 'Dépôt client via plateforme'
          })

          const tx_reference = response.data.transaction.reference_externe

          Swal.fire({
            icon: 'success',
            title: 'Paiement lancé',
            text: 'Veuillez valider le paiement sur votre téléphone.',
            timer: 3000,
            showConfirmButton: false
          })

          this.verifierPaiement(tx_reference)

          // Émettre l'événement avec les bonnes données
          this.$emit('depot-effectue', response.data.transaction)
          this.telephone = ''
          this.methode = ''
          this.localMontant = this.montant

        } catch (error) {
          console.error("Erreur dépôt :", error)

          // Gestion des erreurs spécifiques thgtmorof
          let errorMessage = 'Une erreur est survenue lors du dépôt.'

          if (error.response?.data?.detail) {
            errorMessage = error.response.data.detail
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message
          }

          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: errorMessage
          })
        } finally {
          this.loading = false
        }
      },
      async verifierPaiement(tx_reference) {
        let tentatives = 0
        const interval = setInterval(async () => {
          tentatives++
          try {
            const res = await api.post('portefeuille/verifier-paiement/', { tx_reference })

            if (res.data.message === "Paiement effectué avec succès.") {
              clearInterval(interval)

              Swal.fire({
                icon: 'success',
                title: 'Dépôt réussi',
                text: `Montant : ${res.data.transaction.montant} FCFA`,
              })

              this.$emit('depot-effectue', res.data)
            }
            else if (res.data.statut === "échec") {
              clearInterval(interval)
              Swal.fire({
                icon: 'error',
                title: 'Échec du paiement',
                text: 'Votre dépôt a échoué.'
              })
            }
          } catch (error) {
            console.error("Erreur vérification paiement :", error)
          }

          if (tentatives >= 12) {
            clearInterval(interval)
            Swal.fire({
              icon: 'error',
              title: 'Délai dépassé',
              text: 'Le délai de vérification du paiement a été dépassé. Veuillez réessayer.'
            })
          }
        }, 10000)
      }
    },
  }
</script>

<style scoped>
  .cursor-pointer {
    cursor: pointer;
  }
  .border-primary {
    border: 2px solid #0d6efd !important;
  }
</style>
