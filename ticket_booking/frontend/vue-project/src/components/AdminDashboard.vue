<template>
    <div class="login-container">
    <form class="dashboard-form">
        <UserHistory />
      <div class="quick-links">
        <h2>Quick Links</h2>

          <router-link to="/theatremanagement" class="link">
            <h3>        <div class="links">Theatre Management</div></h3>
          </router-link>
        </div>
        <ExportCsv />
    </form>
  </div>
  </template>
  
<script>
import UserHistory from './UserHistory.vue';
import ExportCsv from './ExportCsv.vue';

export default {
  components: {
    UserHistory,
    ExportCsv
  },
  data() {
    return {
      ticketSales: 1023, // Replace with actual ticket sales data
      numBookings: 567, // Replace with actual number of bookings data
      revenue: "$12560", // Replace with actual revenue data
    };
  },
};
</script>
  
  