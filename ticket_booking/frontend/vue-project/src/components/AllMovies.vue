<template>
  <div class="container mt-4">
    <div class="row">
      <!-- Add Show button -->
      <div class="d-flex justify-content-left mb-4">
        <router-link v-if="isAdmin" to="/showadd" class="btn-view">
          <strong>Add Show</strong>
        </router-link>
      </div>

      <!-- Cards for each show -->
      <div v-for="(Show, index) in Shows" :key="index" class="col-md-4 mb-4">
        <div class="card h-100">
          <!-- Show Image -->
          <img :src="getShowImage(Show.img)" class="card-img-top" :alt="Show.name">

          <!-- Card Body -->
          <div class="card-body">
            <h5 class="card-title">{{ Show.name }}</h5>
            <p class="card-text"><strong>Genre:</strong> {{ Show.genre }}</p>
            <p class="card-text"><strong>Tag:</strong> {{ Show.tags }}</p>
            <p class="card-text"><strong>Time:</strong> {{ Show.time }}</p>
          </div>

          <!-- Card Footer -->
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><strong>Start Date:</strong> {{ Show.start_date.slice(0, 16) }}</li>
            <li class="list-group-item"><strong>End Date:</strong> {{ Show.end_date.slice(0, 16) }}</li>
            <li class="list-group-item"><strong>Ticket Price:</strong> Rs. {{ Show.ticket_price }}</li>
          </ul>

          <!-- View Button -->
          <div class="card-body">
            <button class="btn-view" @click="viewShow(Show, availableSeats(Show))">View</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

  
<script>
export default {
  data() {
    return {
      Shows: null
    };
  },
  computed: {
    availableSeats() {
      return (Show) => Show.capacity - Show.bookings;
    },
  },
  mounted() {
    this.fetchShows()
  },
  methods: {
    viewShow(Show, availableSeats) {
      const showId = Show.id;
      const capacity = Show.capacity;
      const code = Show.theatre_code;
      console.log(code);
      this.$router.push({ path: `/moviedetails/${showId}`, query: { capacity: capacity, code: code } });
    },
    async fetchShows() {
      try {
        const response = await this.$http.get('allshows');
        this.Shows = response.data;

      } catch (error) {
        console.error('Error fetching shows:', error);
      }
    },
    getShowImage(encodedString) {
      return "data:image/png;base64," + encodedString;
    },
  },
};
</script>
