<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-6">
        <img :src="getShowImage(Show.img)" alt="Movie Poster" class="image-preview">
      </div>
      <div class="col-md-6">
  <div class="card mb-4">
    <div class="card-body">
      <h3 class="card-title">{{ Show.name }}</h3>
      <p class="card-text"><strong>Genre:</strong> {{ Show.genre }}</p>
      <p class="card-text"><strong>Tag:</strong> {{ Show.tags }}</p>
      <p class="card-text"><strong>Start Date:</strong> {{ Show.start_date.slice(0, 16) }}</p>
      <p class="card-text"><strong>End Date:</strong> {{ Show.end_date.slice(0, 16) }}</p>
      <p class="card-text"><strong>Ticket Price:</strong> Rs. {{ Show.ticket_price }}</p>
      <p class="card-text"><strong>Theatre Code:</strong> {{ Show.theatre_code }}</p>
      <!-- <p class="card-text"><strong>Available Seats:</strong> {{ capacity - Show.bookings }}</p> -->
      <p class="card-text"><strong>Available Seats:</strong> {{ Show.available_seats }}</p>
      <p class="card-text"><strong>Time:</strong> {{ Show.time }}</p>
      <button class="btn btn-primary" @click="bookNow(Show.id)">Book</button>
    </div>
  </div>
</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      Show : null,
      code: '',
      availableSeats: '',
      imageFile: null,
      imagePreview: null,
      capacity: '',
    };
  },
  mounted() {
    this.fetchShow()

  },
  methods: {
    bookNow(showId){
      const theatreCode = this.Show.theatre_code; 
      this.$router.push({name:"bookshow", params:{showId:showId}, query:{availableSeats : this.availableSeats, code:theatreCode}});
    },

    getShowImage(encodedString) {
      return "data:image/png;base64," + encodedString;
    },

    async fetchShow() {
      try {
        const showId = this.$route.params.showId;
        const capacity = Number(this.$route.query.capacity);
        const code = this.$route.query.code;
        this.capacity = capacity;
        this.code = code;
        const response = await this.$http.get(`show/${showId}`);
        this.Show = response.data;
        this.availableSeats = capacity - Number(this.Show.bookings || 0);
      } catch (error) {
        console.error('Error fetching theatre:', error);
      }
    },
  },
};
</script>

