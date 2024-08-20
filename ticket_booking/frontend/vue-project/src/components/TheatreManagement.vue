<template>
  <div>
    <!-- Add Theatre button -->
    <button v-if="isAdmin" >
      <router-link to="/theatreadd" class="btn btn-primary" style="background-color: black;"><strong>Add New Theatre</strong></router-link>
    </button>
    <br>
    
    <!-- Cards for each theatre -->
    <div class="row" style="margin-left: 2rem; margin-right: 2rem;">
      <div v-for="(theatre, index) in theatres" :key="index" class="card theatre-card">
        <div class="card-body">
          <h5 class="card-title">{{ theatre.name }}</h5>
          <p class="card-text">Address: {{ theatre.address }}</p>
          <p class="card-text">Code: {{ theatre.code }}</p>
          <p class="card-text">ID: {{ theatre.id }}</p>

          <!-- Flexbox container for buttons -->
          <div class="d-flex justify-content-left">
            <button class="btn-view me-2">
              <a href="#" @click.prevent="viewTheatre(theatre.code)">View</a>
            </button>
            <button v-if="isAdmin" class="btn-view me-2">
              <a href="#" @click.prevent="editTheatre(theatre.code)">Edit</a>
            </button>
            <button v-if="isAdmin" class="btn btn-del">
              <a href="#" @click.prevent="toggleDeleteConfirmation(index)">Delete</a>
            </button>
          </div>
          
        </div>

        <!-- Delete Confirmation Dialog -->
        <div v-if="showDeleteConfirmation[index]" class="delete-confirmation">
          <div class="card">
            <h5>Confirm Deletion</h5>
            <p>Are you sure you want to delete this theatre? This action cannot be undone.</p>
            <div class="text-right">
              <button v-if="isAdmin" class="btn btn-danger" @click="deleteTheatre(theatre.code)">Delete</button>
              <button type="button" class="btn btn-secondary" @click="toggleDeleteConfirmation(index)">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { checkAdmin } from '../router/protectRoutes.js';

export default {
  data() {
    return {
      showDeleteConfirmation: {},  // Track the state of delete confirmation for each theatre
      isAdmin: false,
      theatres: [],
    };
  },
  mounted() {
    this.loadTheatres();
    this.checkAdmin();
  },
  methods: {
    toggleDeleteConfirmation(index) {
      // Toggle the delete confirmation for the specific theatre
      this.$set(this.showDeleteConfirmation, index, !this.showDeleteConfirmation[index]);
    },
    checkAdmin() {
      const isAdmin = checkAdmin();
      // console.log(isAdmin);
      if (isAdmin) {
        this.isAdmin = true;
      }
    },
    viewTheatre(theatreCode) {
      // console.log(theatreCode);
      this.$router.push({ name: 'theatres', params: { theatreCode: theatreCode } });
    },
    async loadTheatres() {
      try {
        const response = await this.$http.get('theatres');
        this.theatres = response.data;
        // console.log(this.theatres);
      } catch (error) {
        console.error('Error fetching theatres:', error);
      }
    },
    editTheatre(theatreCode) {
      this.$router.push({ name: 'theatreedit', params: { theatreCode: theatreCode } });
    },
    async deleteTheatre(theatreCode) {
      try {
        const response = await this.$http.delete(`theatre/${theatreCode}`);
        window.alert("Theatre deleted successfully!");
        this.loadTheatres();  // Reload the theatres after deletion
      } catch (error) {
        console.error('Error deleting theatre:', error);
      }
    },
  },
};
</script>
