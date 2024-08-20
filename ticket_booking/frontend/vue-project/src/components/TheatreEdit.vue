<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="editTheatre">

      <h2>Edit Theatre Details</h2>
      <div class="form-group">
        <label for="name">Name:</label>
        <input v-model="name" type="text" id="name" class="form-control"  required>
      </div>
      <div class="form-group">
        <label for="contact">Address:</label>
        <input v-model="address" type="text" id="address" class="form-control" required>
      </div>
      <button class="btn btn-primary" type="submit">Save</button>
    </form>
  </div>
</template>
  
<script>
export default {
  props: {
    theatre: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      name: null,
      address: null,
      // code: null,
    };
  },
  methods: {
    async editTheatre() {
      try {
        const access_token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
        const headers = {
          Authorization: `Bearer ${access_token}`,
        };
        const theaterData = {
          name: this.name,
          address: this.address,
          // code: this.code,
        };
        const code = this.$route.params.theatreCode
        const response = await this.$http.put(`theatre/${code}`, theaterData, { headers });

        if (response.status === 201) {
          console.log("Theatre added successfully!");
          this.$router.push("/theatremanagement");
        } else {
          console.log(response.text);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
  },
};
</script>

  