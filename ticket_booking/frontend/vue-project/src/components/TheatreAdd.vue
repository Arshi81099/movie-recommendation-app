<template>
  <div class="login-container">
    <!-- Add Theatre Form -->
    <form @submit.prevent="saveTheatre" class="dashboard-form">
      <!-- Form Fields -->
      <div class="form-group">
        <label for="name">Theatre Name:</label>
        <input type="text" class="form-control" v-model="newTheatre.name" id="name" required>
      </div>

      <div class="form-group">
        <label for="address">Address:</label>
        <input type="text" class="form-control" v-model="newTheatre.address" id="address" required>
      </div>

      <div class="form-group">
        <label for="code">Theatre Code:</label>
        <input type="text" class="form-control" v-model="newTheatre.code" id="code" required>
      </div>

      <!-- Form Buttons -->
      <div class="form-buttons">
        <button type="submit" class="btn btn-primary">Save Theatre</button>
        <br>
        <button type="button" class="btn btn-delete" @click="cancelForm">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theatres: [],
      newTheatre: {
        name: null,
        address: null,
        code: null,
      },
    };
  },
  methods: {
    async saveTheatre() {
      try {
        const access_token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
        const headers = {
          Authorization: `Bearer ${access_token}`,
        };

        const theaterData = { ...this.newTheatre }; // Using spread syntax to copy the data
        console.log(theaterData);

        const response = await this.$http.post("theatre", theaterData, { headers });

        if (response.status === 201) {
          this.clearForm(); // Clear the form fields
          this.$router.push("/theatremanagement"); // Redirect to theatre management page
        } else {
          console.error(response.statusText);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
    clearForm() {
      this.newTheatre = {
        name: null,
        address: null,
        code: null,
      };
    },
    cancelForm() {
      this.clearForm(); // Clear the form fields
      this.$router.push("/theatremanagement"); // Redirect to theatre management page
    },
  },
};
</script>

