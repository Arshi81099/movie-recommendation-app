<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="bookShow">
      <h2>Book Show</h2>
      <div class="form-group">
        <h5>Show available: {{ Show.start_date.slice(0, 16) }} to {{ Show.end_date.slice(0, 16) }}</h5>
        <p><strong> Time: {{ Show.time }} hrs </strong> </p>
        <p><strong> Price: Rs.{{ Show.ticket_price }} </strong> </p>
        <label for="show_date">Show Date:</label>
        <input v-model="show_date" type="date" id="show_date" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="seats_booked">Seats Booked:</label>
        <input v-model.number="seats_booked" type="number" class="form-control" id="seats_booked" min="1" :max="availableSeats" required @input="updateAvailableSeats">
        <br>
        <p>Seats Available: {{ Show.available_seats }}</p>
        <!-- <p>Seats Left: {{ temp_seats }}</p> -->
        <p>Total Price: {{ totalPrice }} Rs</p>
      </div>
      <button class="btn-primary" type="submit">Book Now</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Show: null,
      show_date: null,
      seats_booked: 0,
      temp_seats: '',
      code: '', 
    };
  },
  computed: {
    totalPrice() {
      return this.seats_booked * this.Show.ticket_price;
    },
  },
  mounted() {
    this.fetchShow();
  },
  methods: {
    async bookShow() {
      const date1 = new Date(this.Show.start_date);
      const date2 = new Date(this.Show.end_date);
      const date = new Date(this.show_date);
      this.code = this.$route.query.code; 

      if (date.getTime() < date1.getTime() || date.getTime() > date2.getTime()) {
        window.alert("OOPs! This date is not available.");
        return;
      }
      const access_token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
      const email = sessionStorage.getItem('email') || localStorage.getItem('email');
      const bookData = {
        book_date: new Date().toISOString(),
        show_date: this.show_date,
        show_time: this.Show.time,
        seats_booked: this.seats_booked,
        theatre: this.code,
        show: this.Show.id,
        email: email,
      };
      console.log(bookData);
      try {
        const response = await this.$http.post("/book", bookData, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        if (response.status === 201) {
          window.alert(`You have successfully booked ${this.seats_booked} seats for ${this.Show.name}!`);
          this.$router.push('/');
        }
      } catch (error) {
        console.error("Error booking show:", error);
      }
    },
    async fetchShow() {
      try {
        const showId = this.$route.params.showId;
        const availableSeats = Number(this.$route.query.availableSeats); // Ensure this is a number
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
        console.error('Error fetching show:', error);
      }
    },
  },
};
</script>
