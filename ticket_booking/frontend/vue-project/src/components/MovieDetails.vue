<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-6">
        <img :src="getShowImage(Show.img)" alt="Movie Poster" class="img-fluid rounded mb-3">
      </div>
      <div class="col-md-6">
        <h2 class="mb-3">{{ Show.name }}</h2>
        <p><strong>Genre:</strong> {{ Show.genre }}</p>
        <p><strong>Tag:</strong> {{ Show.tag }}</p>
        <p><strong>Start Date:</strong> {{ Show.start_date.slice(0, 16) }}</p>
        <p><strong>End Date:</strong> {{ Show.end_date .slice(0, 16)}}</p>
        <p><strong>Ticket Price:</strong> {{ Show.ticket_price }}</p>
        <p><strong> Available Seats:</strong> {{ capacity - Show.bookings }}</p>
        <p><strong>Time:</strong> {{ Show.time }}</p>
        <button @click="bookNow(Show.id)">Book</button>
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
      this.$router.push({name:"bookshow", params:{showId:showId}, query:{availableSeats : this.availableSeats, code:this.code}})
    },
    getShowImage(encodedString) {
      return "data:image/png;base64," + encodedString;
    },

    async fetchShow() {

      try {
        const showId = this.$route.params.showId;
        const capacity = this.$route.query.capacity;
        const code = this.$route.query.code;
        this.capacity = capacity;
        this.code = code;
        const response = await this.$http.get(`show/${showId}`);
        this.Show = response.data;
        this.availableSeats = capacity - this.Show.bookings
      } catch (error) {
        console.error('Error fetching theatre:', error);
      }
    },
  },
};
</script>

