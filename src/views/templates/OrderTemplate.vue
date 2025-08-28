<template>
  <div class="container my-4">
    <h2 class="text-center mb-4">Commander Nos Prestations</h2>
    <div class="row">
      <div v-for="presta in prestations" :key="presta.id" class="col-md-4 mb-4">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">{{ presta.titre }}</h5>
            <p class="card-text text-muted">{{ presta.description }}</p>
            <p class="fw-bold text-primary">{{ presta.prix }} FCFA</p>
            <button class="btn btn-success w-100" @click="commander(presta)">
              Commander
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

  export default {
    name: "OrderTemplate",
    data() {
      return {
        prestations: [],
      };
    },
    methods: {
      async getPrestations() {
        try {
          const response = await api.get('prestation/prestations_avec_prix/');
          this.prestations = response.data;
        } catch (error) {
          console.error("Erreur lors du chargement des prestations", error);
        }
      },
      async commander(presta) {
        const result = await Swal.fire({
          title: `Voulez-vous commander : ${presta.titre} ?`,
          text: `Prix : ${presta.prix} FCFA`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Oui, commander",
          cancelButtonText: "Annuler",
        });

        if (result.isConfirmed) {
          try {
            const user = JSON.parse(localStorage.getItem("auth_user_data"));
            await api.post('commande/register_commande/', {
              prestation: presta.id,
              client: user.id,
              prestataire: presta.prestataire,
            });

            Swal.fire("Succès", "Votre commande a été enregistrée ✅", "success");
          } catch (error) {
            console.error(error);
            Swal.fire("Erreur", "Impossible de passer la commande ❌", "error");
          }
        }
      },
    },
    mounted() {
      this.getPrestations();
    },
  };
</script>