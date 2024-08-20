<template>
  <div class="user-history">
    <h1 class="title">Booking History</h1>
    <div v-if="$route.path !== '/admin'" class="booking-list">
      <div v-for="booking in bookingData" :key="booking.id" class="booking-item">
        <div class="booking-header">
          <h3 class="show-name">{{ booking.show_name }}</h3>
          <span class="show-date">{{ booking.show_date }}</span>
        </div>
        <div class="booking-details">
          <div><strong>Tickets booked:</strong> {{ booking.seats_booked }}</div>
          <div><strong>Time:</strong> {{ booking.show_time }}</div>
          <div><strong>Booking Date:</strong> {{ booking.book_date }}</div>
        </div>
      </div>
    </div>
    <div v-if="$route.path === '/admin'" class="booking-list">
      <div v-for="booking in recent_bookings" :key="booking.id" class="booking-item admin">
        <div class="booking-header">
          <h3 class="show-name">{{ booking.show_name }}</h3>
          <span class="show-date">{{ booking.show_date }}</span>
        </div>
        <div class="booking-details">
          <div><strong>Tickets booked:</strong> {{ booking.seats_booked }}</div>
          <div><strong>Time:</strong> {{ booking.show_time }}</div>
          <div><strong>Booking Date:</strong> {{ booking.book_date }}</div>
        </div>
      </div>
    </div>
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

        // Assuming the entire array is user bookings
        this.bookingData = response.data;

        // If you want to extract recent bookings, you can do something like this:
        // For example, let's assume "recent" means bookings with the most recent show date.
        this.recent_bookings = this.bookingData.filter((booking) => {
            const showDate = new Date(booking.show_date);
            const today = new Date();
            return showDate >= today;
        });

        console.log('Booking data:', this.bookingData);
        console.log('Recent bookings:', this.recent_bookings);

          } catch (error) {
              console.error('Error fetching booking data:', error);
          }
      },
  }
};
</script>
