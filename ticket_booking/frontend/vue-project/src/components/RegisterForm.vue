<template>
  <div class="signup-container">
  <form class="signup-form" @submit.prevent="registerForm">
    <div class="form-group">
      <label for="name">Name</label>
      <input v-model="name" type="text" class="form-control" id="name" placeholder="Enter name" required>
    </div>
    <div class="form-group">
      <label for="email">Email address</label>
      <input v-model="email" type="email" class="form-control" id="email" aria-describedby="emailHelp"
        placeholder="Enter email" required>
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input v-model="password" type="password" class="form-control" id="password" placeholder="Password" required>
    </div>
    <div class="form-group">
      <label for="conpassword">Confirm Password</label>
      <input v-model="conpassword" type="password" class="form-control" id="conpassword" placeholder="Confirm Password"
        required>
    </div>
    <button type="submit" class="btn btn-primary">Sign Up</button>
  </form>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
  },
  computed: {
    signupData() {
      return {
        name: this.name,
        email: this.email,
        password: this.password,
      };
    },
  },
  methods: {
    checkPasswordMatch() {
      if (this.password !== this.conpassword) {
        window.alert("Your Password and confirm password should be the same.");
        return false;
      }
      return true;
    },
    async registerForm() {
      if (!this.checkPasswordMatch()) {
        return;
      }

      try {
        const response = await this.$http.post('user', this.signupData);

        if (response.status === 201) {
          const name = this.name;
          const email = this.email;
          const access_token = response.data.access_token;
          const id = response.data.id;
          // console.log(access_token);


          sessionStorage.setItem('name', name);
          sessionStorage.setItem('email', email);
          sessionStorage.setItem('access_token', access_token);

          this.$router.push('/');

        } else {
          console.log(response.text);
          this.signupStatus = 'error';
        }
      } catch (error) {
        console.error('An error occurred:', error);
        this.signupStatus = 'error';
      }
    },
  },
};
</script>
  

  