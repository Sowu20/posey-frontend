<template>
  <div class="container py-5">
    <!-- Liste des services -->
    <div class="row">
      <div v-for="service in paginatedServices" :key="service.id" class="col-md-4 mb-3">
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

    <!-- Pagination -->
    <nav v-if="totalPages > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="changePage(currentPage - 1)">Précédent</button>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
          <button class="page-link" @click="changePage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="changePage(currentPage + 1)">Suivant</button>
        </li>
      </ul>
    </nav>

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
                <input type="text" v-model="form.nom" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Catégorie</label>
                <select v-model="form.categorie" class="form-select" required>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.nom }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea v-model="form.description" class="form-control" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Prix</label>
                <input type="number" v-model="form.prix" class="form-control" step="0.01" required />
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
  import Swal from 'sweetalert2';

  export default {
    name: 'ServicesProvider',
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
        currentPage: 1,
        perPage: 3,
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.services.length / this.perPage);
      },
      paginatedServices() {
        const start = (this.currentPage - 1) * this.perPage;
        return this.services.slice(start, start + this.perPage);
      }
    },
    methods: {
      async fetchServices() {
        try {
          const user = JSON.parse(localStorage.getItem("auth_user_data"));
          if (!user?.id) {
            Swal.fire("Erreur", "Utilisateur non authentifié", "error");
            return;
          }

          const res = await api.get(`/service/list_service/${user.id}/`);
          this.services = res.data;
          this.currentPage = 1;
        } catch {
          Swal.fire("Erreur", "Impossible de charger les services", "error");
        }
      },
      async fetchCategories() {
        try {
          const res = await api.get('prestation/detail_categorie/');
          this.categories = res.data;
        } catch {
          Swal.fire("Erreur", "Impossible de charger les catégories", "error");
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

        if (!this.modal) {
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
            Swal.fire("Succès", "Service modifié ✅", "success");
          } else {
            await api.post("services/mes_services/", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            Swal.fire("Succès", "Service ajouté ✅", "success");
          }

          this.modal.hide();
          this.fetchServices();
        } catch {
          Swal.fire("Erreur", "Impossible d'enregistrer le service", "error");
        }
      },
      async deleteService(id) {
        const result = await Swal.fire({
          title: "Êtes-vous sûr ?",
          text: "Cette action est irréversible",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Oui, supprimer",
          cancelButtonText: "Annuler"
        });

        if (result.isConfirmed) {
          try {
            await api.delete(`services/mes_services/${id}/`);
            Swal.fire("Succès", "Service supprimé ✅", "success");
            this.fetchServices();
          } catch {
            Swal.fire("Erreur", "Impossible de supprimer le service", "error");
          }
        }
      },
      changePage(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.currentPage = page;
        }
      }
    },
    created() {
      this.fetchServices();
      this.fetchCategories();
    },
  };
</script>
