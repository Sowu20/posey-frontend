<template>
  <div class="container py-5">
    <h3 class="mb-4">Mes Services</h3>

    <!-- Messages -->
    <div v-if="successMessage" class="alert alert-success">Message de succès</div>
    <div v-if="errorMessage" class="alert alert-danger">Message d'échec</div>

    <!-- Liste des services -->
    <div class="row">
      <div v-for="service in services" :key="service.id" class="col-md-4 mb-3">
        <div class="card shadow-sm h-100">
          <img :src="service.image || '/img/default-service.png'" class="card-img-top" alt="services">
          <div class="card-body">
            <h5 class="card-title">{{ service.nom }}</h5>
            <p class="card-text">{{ service.description }}</p>
            <p><strong>Prix: </strong>{{ service.prix }} FCFA</p>
            <p class="card-text">{{ service.categorie_nom }}</p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-sm btn-warning" @click="openModal('edit', service)">Modifier</button>
            <button class="btn btn-sm btn-danger" @click="deleteService(service.id)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Ajout d'un service -->
    <div class="text-center mt-4">
      <button class="btn btn-primary" @click="openModal('add')">Ajouter un service</button>
    </div>

    <!-- Modal Ajout/Modification -->
    <div class="modal fade" id="serviceModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">{{ isEdit ? "Modifier le service" : "Ajouter un service" }}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <form @submit.prevent="saveService">
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Nom</label>
                <input type="text" v-model="form.nom" class="form-control">
              </div>
              <div class="mb-3">
                <label class="form-label">Catégorie</label>
                <select class="form-select" required>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea v-model="form.description" class="form-control"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Prix</label>
                <input type="number" v-model="form.prix" class="form-control" step="0.01" />
              </div>
              <div class="mb-3">
                <label class="form-label">Image</label>
                <input type="file" @change="handleImage" class="form-control" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
              <button type="submit" class="btn btn-primary">{{ isEdit ? "Modifier" : "Ajouter" }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../services/api';
  import { Modal } from 'bootstrap';

  export default {
    data() {
      return {
        services: [],
        categories: [],
        form: {
          id: null,
          nom: "",
          categorie: "",
          description: "",
          prix: null,
          image: null
        },
        isEdit: false,
        modal: null,
        successMessage: null,
        errorMessage: null,
      };
    },
    methods: {
      async fetchService() {
        try {
          const user = JSON.parse(localStorage.getItem("auth_user_data"));
          if (!user?.id) {
            this.errorMessage = "Utilisateur non authentifié";
            return;
          }

          const res = await api.get(`/service/list_service/${user.id}/`);
          this.services = res.data;
        } catch {
          this.errorMessage = "Erreur lors du chargement des services"
        }
      },
      async fetchCategories() {
        try {
          const res = await api.get('prestation/detail_categorie/');
          this.categories = res.data;
        } catch {
          this.errorMessage = "Erreur lors du chargement des catégories"
        }
      },
      handleImage(e) {
        this.form.image = e.target.files[0];
      },
      openModal(type, service = null) {
        this.isEdit = type === "edit";
        if (this.isEdit && service) {
          this.form = {
            id: service.id,
            nom: service.nom,
            categorie: service.categorie,
            description: service.description,
            prix: service.prix,
            image: null,
          };
        } else {
          this.form = { id: null, nom: "", categorie: "", description: "", prix: null, image: null };
        }

        if(!this.modal) {
          this.modal = new Modal(document.getElementById("serviceModal"));
        }
        this.modal.show();
      },
      async saveService() {
        try {
          const formData = new FormData();
          for (const key in this.form) {
            if (this.form[key]) formData.append(key, this.form[key]);
          }

          if (this.isEdit) {
            await api.put(`service/mes_services/${this.form.id}/`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            this.successMessage = "Service modifié ✅";
          } else {
            await api.post("services/mes_services/", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            this.successMessage = "Service ajouté ✅";
          }

          this.errorMessage = null;
          this.modal.hide();
          this.fetchServices();
        } catch {
          this.errorMessage = "Erreur lors de l'enregistrement ❌";
          this.successMessage = null;
        }
      },
      async deleteService(id) {
        if (!confirm("Voulez-vous vraiment supprimer ce service ?")) return;
        try {
          await api.delete(`services/mes_services/${id}/`);
          this.successMessage = "Service supprimé ✅";
          this.fetchServices();
        } catch {
          this.errorMessage = "Erreur lors de la suppression ❌";
        }
      },
    },
    created() {
      this.fetchServices();
      this.fetchCategories();
    },
    name: 'ServicesProvider',
  }
</script>
