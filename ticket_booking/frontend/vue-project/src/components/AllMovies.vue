<template>
  <div class="container mt-4">
    <table class="show-table">
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
          <th>View</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(Show, index) in Shows" :key="index">
          <td>{{ Show.name }}</td>
          <td>{{ Show.genre }}</td>
          <td>{{ Show.tag }}</td>
          <td>{{ Show.time }}</td>
          <td> <img :src="getShowImage(Show.img)" class="card-img" :alt="Show.name"></td>

          <td>{{ Show.start_date.slice(0, 16) }}</td>
          <td>{{ Show.end_date.slice(0, 16) }}</td>
          <td>{{ Show.ticket_price }}</td>
          <td>
            <button @click="viewShow(Show, availableSeats(Show))">View</button>
          </td>
        </tr>
      </tbody>
    </table>
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
