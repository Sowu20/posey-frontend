<template>
  <div class="container my-4">
    <div class="row">
      <div v-for="presta in prestations" :key="presta.id" class="col-md-4 mb-4">
        <div class="card shadow-sm h-100">
          <img v-if="categorieprestation.image" :src="categorieprestation.image" class="card-img-top" alt="Image prestation" style="height: 200px; object-fit: cover;" >
          <img v-else src="/img/default-service.png" class="card-img-top" alt="Image par défaut" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">{{ presta.titre }}</h5>
            <p class="card-text text-muted">{{ presta.description }}</p>
            <p class="fw-bold text-primary">{{ presta.prix }} FCFA</p>
            <button class="btn btn-primary w-100" @click="ouvrirModal(presta)">
              Commander
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de paiement -->
    <div class="modal fade" id="paiementModal" tabindex="-1" aria-hidden="true" ref="paiementModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Paiement de la prestation</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p class="fw-bold">{{ prestationChoisie?.titre }}</p>
            <p>Prix : <span class="text-primary">{{ prestationChoisie?.prix }} FCFA</span></p>

            <div class="mb-3">
              <label class="form-label">Numéro de Téléphone</label>
              <input v-model="telephone" type="text" class="form-control" placeholder="Ex: 99 00 00 00" />
            </div>

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
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary w-100" @click="payerCommande" :disabled="loading">
              {{ loading ? "Traitement..." : "Payer et Commander" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Swal from "sweetalert2";
  import api from "../services/api";
  import { Modal } from "bootstrap";

  export default {
    name: "OrderPrestation",
    data() {
      return {
        prestations: [],
        categorieprestation: [],
        prestationChoisie: null,
        telephone: "",
        methode: "",
        loading: false,
        paiementModal: null,
      };
    },
    methods: {
      async getPrestations() {
        try {
          const response = await api.get("prestation/prestations_avec_prix/");
          this.prestations = response.data;
        } catch (error) {
          console.error("Erreur lors du chargement des prestations", error);
        }
      },
      ouvrirModal(presta) {
        this.prestationChoisie = presta;
        this.telephone = "";
        this.methode = "";
        if (!this.paiementModal) {
          this.paiementModal = new Modal(this.$refs.paiementModal);
        }
        this.paiementModal.show();
      },
      async payerCommande() {
        if (!this.telephone || !this.methode) {
          Swal.fire("Champs manquants", "Veuillez remplir tous les champs.", "warning");
          return;
        }

        const user = JSON.parse(localStorage.getItem("auth_user_data"));
        if (!user) {
          Swal.fire("Erreur", "Veuillez vous connecter pour commander.", "error");
          return;
        }

        this.loading = true;
        try {
          // 1. Lancer paiement PayGate
          const resp = await api.post("portefeuille/recharge/", {
            user_id: user.id,
            phone_number: this.telephone.replace(/\s/g, ""),
            amount: parseFloat(this.prestationChoisie.prix),
            network: this.methode,
            description: `Paiement de prestation ${this.prestationChoisie.titre}`,
            type_transaction: "paiement",
          });

          const tx_reference = resp.data.transaction.reference_externe;

          Swal.fire("Paiement lancé", "Veuillez valider le paiement sur votre téléphone.", "info");

          // 2. Vérifier paiement
          const verifier = setInterval(async () => {
            try {
              const res = await api.post("portefeuille/verifier-paiement/", { tx_reference });

              if (res.data.message === "Paiement confirmé.") {
                clearInterval(verifier);

                // 3. Créer commande après succès paiement
                await api.post("commande/register_commande/", {
                  prestation: this.prestationChoisie.id,
                  client: user.id,
                });

                Swal.fire("Succès", "Commande payée et enregistrée ✅", "success");
                this.paiementModal.hide();
              }
              else if (res.data.message === "Paiement échoué") {
                clearInterval(verifier);
                Swal.fire("Échec", "Le paiement a échoué ❌", "error");
              }
            } catch (err) {
              console.error("Erreur vérification paiement", err);
            }
          }, 10000);

        } catch (error) {
          console.error("Erreur paiement :", error);
          Swal.fire("Erreur", "Impossible de lancer le paiement ❌", "error");
        } finally {
          this.loading = false;
        }
      },
    },
    mounted() {
      this.getPrestations();
    },
  };
</script>

<style scoped>
  .cursor-pointer {
    cursor: pointer;
  }
  .border-primary {
    border: 2px solid #0d6efd !important;
  }
</style>
