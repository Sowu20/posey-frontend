<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Gestion des Catégories de Prestation</h2>

    <!-- Formulaire -->
    <form @submit.prevent="handleSubmit" class="space-y-4 bg-white shadow-md rounded p-4 mb-6">
      <div>
        <label class="block font-semibold">Nom</label>
        <input v-model="form.nom" type="text" class="w-full border px-3 py-2 rounded" required />
      </div>
      <div>
        <label class="block font-semibold">Description</label>
        <textarea v-model="form.description" class="w-full border px-3 py-2 rounded"></textarea>
      </div>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
        {{ isEditing ? 'Modifier' : 'Ajouter' }}
      </button>
      <button v-if="isEditing" @click="resetForm" type="button" class="ml-2 text-red-500">Annuler</button>
    </form>

    <!-- Table des catégories -->
    <table class="w-full table-auto border-collapse">
      <thead class="bg-gray-200">
        <tr>
          <th class="border px-4 py-2">ID</th>
          <th class="border px-4 py-2">Nom</th>
          <th class="border px-4 py-2">Description</th>
          <th class="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cat in categories" :key="cat.id" class="text-center">
          <td class="border px-4 py-2">{{ cat.id }}</td>
          <td class="border px-4 py-2">{{ cat.nom }}</td>
          <td class="border px-4 py-2">{{ cat.description }}</td>
          <td class="border px-4 py-2">
            <button @click="editCategorie(cat)" class="text-blue-600 hover:underline mr-2">Modifier</button>
            <button @click="deleteCategorie(cat.id)" class="text-red-600 hover:underline">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import api from '../services/api';

  export default {
    name: "GestionCategoriePrestation",
    data() {
      return {
        categories: [],
        form: {
          nom: "",
          description: "",
        },
        isEditing: false,
        editId: null,
      };
    },
    mounted() {
      this.fetchCategories();
    },
    methods: {
      async fetchCategories() {
        try {
          const res = await api.get("/detail_categorie/");
          this.categories = res.data;
        } catch (error) {
          console.error("Erreur de chargement des catégories", error);
        }
      },
      async handleSubmit() {
        try {
          if (this.isEditing) {
            await api.put(`/update_categorie/${this.editId}/`, this.form);
          } else {
            await api.post("/detail_categorie/", this.form);
          }
          this.fetchCategories();
          this.resetForm();
        } catch (error) {
          console.error("Erreur lors de la soumission du formulaire", error);
        }
      },
      editCategorie(cat) {
        this.form.nom = cat.nom;
        this.form.description = cat.description;
        this.editId = cat.id;
        this.isEditing = true;
      },
      resetForm() {
        this.form.nom = "";
        this.form.description = "";
        this.isEditing = false;
        this.editId = null;
      },
      async deleteCategorie(id) {
        if (confirm("Confirmer la suppression ?")) {
          try {
            await api.delete(`/delete_categorie/${id}/`);
            this.fetchCategories();
          } catch (error) {
            console.error("Erreur lors de la suppression", error);
          }
        }
      },
    },
  };
</script>

<style scoped>
  table {
    border: 1px solid #ccc;
  }
</style>