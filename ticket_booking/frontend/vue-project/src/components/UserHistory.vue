<template>
    <div class="user-history">
      <h1><strong>Booking History</strong></h1>
      <ul v-if="$route.path !== '/admin'" >
        <li v-for="booking in bookingData" :key="booking.id">
          <span><strong>Tickets booked:</strong> {{ booking.seats_booked }}</span><br>
          <span><strong>Show:</strong> {{ booking.show_name }}</span><br>
          <span><strong>Show Date:</strong> {{ booking.show_date }}</span><br>
          <span><strong>Time:</strong> {{ booking.show_time }}</span><br>
          <span><strong>Booking Date:</strong> {{ booking.book_date }}</span>
        </li>
      </ul>
      <ul v-if="$route.path === '/admin'" >
        <li v-for="booking in recent_bookings" :key="booking.id">
          <span><strong>Tickets booked:</strong> {{ booking.seats_booked }}</span><br>
          <span><strong>Show:</strong> {{ booking.show_name }}</span><br>
          <span><strong>Show Date:</strong> {{ booking.show_date }}</span><br>
          <span><strong>Time:</strong> {{ booking.show_time }}</span><br>
          <span><strong>Booking Date:</strong> {{ booking.book_date }}</span>
        </li>
      </ul>
    </div>
  </template>
  
<script>
export default {
  data() {
      return {
          bookingData: [],
          recent_bookings:[],
      };
  },
  mounted() {
    this.fetchBookingData()
  },
  methods: {
    async fetchBookingData() {
          try {
              const email = sessionStorage.getItem('email') || localStorage.getItem('email');
              const access_token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
              const headers = {
                  Authorization: `Bearer ${access_token}`,
              };
              const response = await this.$http.get('book', {
                  params: { email: email },
                  headers: headers,
              });
              this.bookingData = response.data.user_bookings;
              this.recent_bookings = response.data.recent_bookings;
          } catch (error) {
              console.error('Error fetching booking data:', error);
          }
      },
  }
};
</script>
