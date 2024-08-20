<template>
  <div class="login-container">
    <!-- Personal Details Card -->
    <div class="row dashboard" >
      <div class="col-md-6" >

          <div class="card-body" >
            <h2>Welcome, {{ user.name }}</h2>
            <p>Email: {{ user.email }}</p>

            <h3>Update Personal Details</h3>
            <form @submit.prevent="updateDetails">
              <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" class="form-control" v-model="name" id="name">
              </div>
              <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" class="form-control" v-model="pass" id="password" required>
              </div>
              <div class="form-group">
                <label for="confirm-password">Confirm Password:</label>
                <input type="password" class="form-control" v-model="confirmpassword" id="confirm-password" required>
              </div>
              <button type="submit" class="btn btn-primary">Update Details</button>
              <br>
              <button type="button" class="btn btn-delete" @click="showDeleteConfirmation = true">Delete Account</button>
              <div v-if="showDeleteConfirmation" class="mt-4">
                <h5>Confirm Deletion</h5>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div class="text-right">
                  <button type="button" class="btn btn-delete" @click="deleteUser">Delete</button>
                  <br>
                  <button type="button" class="btn btn-primary" @click="showDeleteConfirmation = false">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        
      </div>

      <!-- Booking History and UserReport Card -->
      <div class="col-md-6">
        <div class="card hist">
          <div class="card-body">
            <button type="button" class="btn btn-primary" @click="bookHistory">Booking History</button>
            <UserReport />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import UserReport from './UserReport.vue';
export default {
  components: {
    UserReport,
  },
  data() {
    return {
      showDeleteConfirmation: false,
      user: null,
      name: "",
      // email : "",
      pass: "",
      confirmpassword: "",
      n_email: ""
    };
  },
  computed: {
    updateData() {
      return {
        name: this.name,
        // n_email: this.email,
        email: sessionStorage.getItem("email"),
        password: this.password,
      };
    },
  },
  mounted() {
    this.fetchUser()
  },
  methods: {
    bookHistory() {
      this.$router.push("/userhistory")
    },
    async fetchUser() {
      const email = sessionStorage.getItem('email') || localStorage.getItem('email');
      try {
        const access_token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
        const headers = {
          Authorization: `Bearer ${access_token}`,
        };
        const data = { "email": email }
        // console.log(headers)
        const response = await this.$http.get('user', { params: data, headers: headers });
        this.user = response.data;
      } catch (error) {
        console.error('Error fetching theatre:', error);
      }
    },
    async updateDetails() {
      const access_token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      if (this.password != this.confirmpassword) {
        window.alert("Your Password and confirm password should be same.")
        // console.log(this.password, this.confirmpassword)
        return
      }
      if (this.name.trim() === "") {
        delete this.updateData.name

      }
      const response = await this.$http.put('user', this.updateData, { headers: headers });
      if (response.status === 201) {
        this.password = '',
        window.alert("details updated successfully!")
        this.$router.push('/userdashboard');
        window.location.reload()
      } else if (response.status === 400) {
        // console.log(response.data)
        const error_message = response.data.error_message;
        // console.log(error_message)
        window.alert(error_message)
        // console.log(response.text)
      }
      else {
        console.log(response.status, response.data.text)
      }
    },
    changePassword() {

      const newPasswordData = {
        newPassword: this.newPassword,
      };
      this.newPassword = '';
    },
    async deleteUser(email) {
      try {
        const access_token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
        const headers = {
          Authorization: `Bearer ${access_token}`,
        };
        const data = {
          email: email,
          password: this.pass, 
        };
        if (this.pass === this.password){
          window.alert("Incorrect Password")
          return
        }
        const response = await this.$http.delete('user', {
          data: data,
          headers: headers,
        });

        if (response.status === 200) {
          window.alert("Account deleted successfully!");
          this.$router.push("/");
          sessionStorage.clear();
          localStorage.clear();
          window.location.reload();
        } else if(response.status === 400)
         {
          window.alert("Failed to delete the account. Please provide correct password.");
        }
      } catch (error) {
        console.log(error.status);
        window.alert("An error occurred while deleting the account. Please try again.");
      }
    },

  },
};
</script>