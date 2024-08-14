<template>
  <div class="book-form">
    <h2>Book Show</h2>
    <form @submit.prevent="bookShow">
      <div class="form-group">
        <h3>Show available from {{ Show.start_date.slice(0, 16) }} to {{ Show.end_date.slice(0, 16) }}</h3>
        <p>Time: {{ Show.time }} hrs </p>
        <label for="show_date">Show Date:</label>
        <input v-model="show_date" type="date" id="show_date" required>
      </div>
      <div class="form-group">
        <label for="seats_booked">Seats Booked:</label>
        <input v-model.number="seats_booked" type="number" id="seats_booked" min="1" :max="availableSeats" required
          @input="updateAvailableSeats">
        <p>Total seats: {{ availableSeats }}</p>
        <p>Available seats: {{ temp_seats }}</p>
        <p>Total Price: {{ Show.ticket_price * seats_booked }} Rs</p>
      </div>
      <button type="submit">Book Now</button>
    </form>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      Show: null,
      show_date: null,
      show_time: null,
      seats_booked: null,
      temp_seats: '',
      availableSeats: '', // Replace with the actual available seats count
      pricePerSeat: '',
    };
  },
  computed: {
    totalPrice() {
      // console.log(this.Show.ticket_price)

      return this.seats_booked * this.Show.ticket_price;
    },
  },
  mounted() {
    this.fetchShow()
  },
  methods: {
    updateAvailableSeats() {
      if (this.seats_booked >= 0 && this.seats_booked <= this.availableSeats) {
        this.temp_seats = this.availableSeats - this.seats_booked;
        // Replace '10' with the total number of seats
        // console.log(this.temp_seats)
      } else {
        this.temp_seats = `you can't book more than ${this.availableSeats}`
      }

    },
    async bookShow() {
      const date1 = new Date(this.Show.start_date);
      const date2 = new Date(this.Show.end_date);
      const date = new Date(this.show_date);
      if (date.getTime() < date1.getTime() || date.getTime() > date2.getTime()) {
        window.alert("OOPs ! this date is not available.");
        return;
      }
      const access_token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
      const email = sessionStorage.getItem('email') || localStorage.getItem('email');
      const bookData = {
        show_date: this.show_date,
        show_time: this.Show.time,
        seats_booked: this.seats_booked,
        theatre_code: this.code,
        showid: this.Show.id,
        email: email,

      };
      try {
        const response = await this.$http.post("/book", bookData, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },);
        if (response.status === 201) {
          window.alert(`You have successfully booked ${this.seats_booked} seats for ${this.Show.name}!`)
          this.$router.push('/')
        }
      } catch (error) {
        console.error("Error booking show:", error);
      }
    },
    async fetchShow() {

      try {

        const showId = this.$route.params.showId;
        const availableSeats = this.$route.query.availableSeats;
        const code = this.$route.query.code;
        this.availableSeats = availableSeats;
        this.code = code;
        const response = await this.$http.get(`show/${showId}`);
        this.Show = response.data;
        if (this.availableSeats === 0) {
          window.alert("OOPs! Show is HOUSEFULL!");
          this.$router.push('/');
        }
      } catch (error) {
        console.error('Error fetching theatre:', error);
      }
    },
  },
};
</script>
