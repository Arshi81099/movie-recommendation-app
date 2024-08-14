<template>
  <div>
    <!-- Add Theatre button -->
    <button v-if="isAdmin" ><router-link to="/showadd"> Add Show</router-link></button>

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Genre</th>
          <th>Tag</th>
          <th>Time</th>
          <th>Image</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th> Ticket Price</th>
          <th v-if="isAdmin">Edit/Delete</th>
          <th v-if="!isAdmin">View</th>
        </tr>
      </thead>
      <!-- Table Body -->
      <tbody>
        <tr v-for="(Show, index) in Shows" :key="index">
          <td>{{ Show.name }}</td>
          <td>{{ Show.genre }}</td>
          <td>{{ Show.tag }}</td>
          <td>{{ Show.time }}</td>
          <td><img :src="getShowImage(Show.img)" class="card-img" :alt="Show.name"></td>

          <td>{{ Show.start_date.slice(0, 16) }}</td>
          <td>{{ Show.end_date.slice(0, 16) }}</td>
          <td>{{ Show.ticket_price }}</td>
          <td>
            <button v-if="isAdmin" :code="code" @click="editShowtime(Show.id)">Edit</button>
            <button v-if="isAdmin" class="btn btn-danger"
            @click="showDeleteConfirmation = true">Delete show</button>
            <div v-if="showDeleteConfirmation" class="mt-4">
            <h5>Confirm Deletion</h5>
            <p>Are you sure you want to delete this show? This action cannot be undone.</p>
            <div class="text-right">
              <button v-if="isAdmin" class=" btn btn-danger" @click="deleteShowtime(Show.id)">Delete</button>
              <button type="button" class="btn btn-secondary" @click="showDeleteConfirmation = false">Cancel</button>
            </div>
          </div>
            <button @click="viewShow(Show.id, availableSeats(Show, capacity))">View</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
<script>
import { checkAdmin } from '../router/protectRoutes.js';
export default {
  props: ["code", "capacity"],
  data() {
    return {
      showDeleteConfirmation: false,
      isAdmin: false,
      Shows: [], 
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
        console.log(this.code);
        const response = await this.$http.get(`theatres/${this.code}`); 
        this.Shows = response.data;
        console.log(this.shows);
      } catch (error) {
        console.error('Error fetching shows:', error);
      }
    },
    editShowtime(showId) {
      // this.$router.push({ name: 'showedit', params: { showId: showId } });
      this.$router.push({ path: `/showedit/${showId}`, query: { code: this.code } });
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