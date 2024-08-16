<template>
  <div>
    <!-- Add Show button -->
  <div class="center-container">
    <router-link v-if="isAdmin" to="/showadd" class="btn-view">
    <strong>Add Show</strong>
    </router-link>
  </div>

    <!-- Cards for each show -->
    <div class="row">
      <div v-for="(Show, index) in Shows" :key="index" class="col-md-4 mb-4">
        <div class="card h-100">
          <img :src="getShowImage(Show.img)" class="card-img-top" :alt="Show.name">
          <div class="card-body">
            <h5 class="card-title">{{ Show.name }}</h5>
            <p class="card-text"><strong>Genre:</strong> {{ Show.genre }}</p>
            <p class="card-text"><strong>Tag:</strong> {{ Show.tags }}</p>
            <p class="card-text"><strong>Time:</strong> {{ Show.time }}</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><strong>Start Date:</strong> {{ Show.start_date.slice(0, 16) }}</li>
            <li class="list-group-item"><strong>End Date:</strong> {{ Show.end_date.slice(0, 16) }}</li>
            <li class="list-group-item"><strong>Ticket Price:</strong> {{ Show.ticket_price }}</li>
          </ul>
          <div class="card-body row">
            <button class="btn-view me-2" @click.prevent="viewShow(Show.id, availableSeats(Show, capacity))">View</button>
            <button v-if="isAdmin" class="btn-view me-2" @click.prevent="editShowtime(Show.id)">Edit</button>
            <button v-if="isAdmin" class="btn-del me-2" @click.prevent="openDeleteConfirmation(Show.id)">Delete</button>

            <!-- Delete Confirmation Dialog -->
            <div v-if="selectedShow === Show.id && showDeleteConfirmation" class="mt-4 card">
              <div class="card-body">
                <h5>Confirm Deletion</h5>
                <p>Are you sure you want to delete this show? This action cannot be undone.</p>
                <div class="text-right">
                  <button class="btn btn-danger mr-2" @click="deleteShowtime(Show.id)">Delete</button>
                  <button type="button" class="btn btn-secondary" @click="closeDeleteConfirmation">Cancel</button>
                </div>
              </div>
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
  props: ["code", "capacity", "id"],
  data() {
    return {
      showDeleteConfirmation: false,
      isAdmin: false,
      Shows: [], 
      selectedShow: null, 
    };
  },
  created() {
    this.loadShows();
    this.checkAdmin();
  },
  computed: {
    availableSeats() {
      // console.log(this.capacity)
      return (show) => this.capacity - show.bookings;
    },
 },
  methods: {
    viewShow(showId, availableSeats) {
      this.$router.push({ path: `/moviedetails/${showId}`, query: { capacity: this.capacity, code: this.code } });
    },
    checkAdmin() {
      const isAdmin = checkAdmin();
      // console.log(isAdmin)
      if (isAdmin) {
        this.isAdmin = true;
      }
    },
    getShowImage(encodedString) {
      return "data:image/png;base64," + encodedString;
    },
    async loadShows() {
      try {
        const response = await this.$http.get(`theatres/${this.code}`); 
        this.Shows = response.data;
        // console.log(this.shows);
      } catch (error) {
        console.error('Error fetching shows:', error);
      }
    },
    editShowtime(showId) {
      // this.$router.push({ name: 'showedit', params: { showId: showId } });
      this.$router.push({ path: `/showedit/${showId}`, query: { code: this.code } });
    },
    openDeleteConfirmation(showId) {
      this.selectedShow = showId;
      this.showDeleteConfirmation = true;
    },
    closeDeleteConfirmation() {
      this.showDeleteConfirmation = false;
      this.selectedShow = null;
    },
    async deleteShowtime(showId) {
      const access_token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
      const response = await this.$http.delete(`show/${showId}`, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${access_token}`,
          },
        });
      window.alert("Show deleted successfully!");
      this.loadShows(); 
    },
  },
};
</script>