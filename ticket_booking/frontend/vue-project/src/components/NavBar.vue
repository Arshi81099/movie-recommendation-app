<template>
  <v-app-bar app color="black" dark class="custom-navbar">

    <!-- Main logo/title -->
    <v-toolbar-title class=" mx-2 navbar-title">
      <router-link to="/">
        <img src="../assets/logoj.jpeg" alt="Logo" class="logo" />
        Ticket Show
      </router-link>
    </v-toolbar-title>
    
    <!-- Search bar -->
    <form @submit.prevent="submitSearch" class="d-none d-md-flex mx-3 search-box">
      <div class="input-group">
        <input type="text" class="form-control search-text" placeholder="Search your movie or theatre" v-model="searchQuery">
        <div>
          <button class="btn-search" type="submit">Search</button>
        </div>
      </div>
    </form>

    <!-- Navigation links -->
    <!-- <v-spacer class="d-none d-md-flex"></v-spacer> -->
    <v-btn><router-link to="/movies" class="btn flex-grow-1 mx-2 ml-3">Movies</router-link></v-btn>
    <v-btn><router-link to="/theatremanagement" class="btn mx-2">Theatres</router-link></v-btn>

    <!-- User account actions -->
    <template v-if="isLoggedIn">
      <v-btn ><router-link class="btn mx-2" to="/userdashboard">Profile</router-link></v-btn>

      <v-btn class="btn mx-2" @click="logout">Logout</v-btn>

      <v-btn v-if="isAdmin">
        <router-link  class="btn mx-2" to="/admin">Admin</router-link>
      </v-btn>
    </template>
    
    <template v-else>
      <v-btn class="btn d-none d-md-block mx-2" v-if="!isLoggedIn && $route.path != '/login'" @click="login">Login</v-btn>
      <v-btn class="btn d-none d-md-block mx-2" @click="register">Register</v-btn>
    </template>
    <!-- <template v-if="isAdmin" >
        <v-btn class="btn mx-2 d-none d-md-block">
        <router-link to="/admindashboard">Admin</router-link>
      </v-btn>
      </template> -->
  </v-app-bar>
</template>

<script>
import { checkAdmin } from '../router/protectRoutes.js';
export default {
  data() {
    return {
      isAdmin: false,
      searchQuery: '',
  
    };
  },
  mounted() {
    // this.loadShows();
    this.checkAdmin();
  },
  computed: {
    isLoggedIn() {
      const accessToken = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
      // console.log(accessToken)
      return !!accessToken; 
    }
  },
  methods: {
    checkAdmin() {
      const isAdmin = checkAdmin();
      // console.log(isAdmin)
      if (isAdmin) {
        this.isAdmin = true;
      }
    },
    submitSearch() {
      //  console.log(this.searchQuery)
       this.$router.push({
        name: 'searchpage',
        query: { searchQuery: this.searchQuery }
      });
      this.searchQuery = '';
      },
    login() {
      this.$router.push('/login');
    },
    register() {
      this.$router.push('/register');
    },
    async logout() {
      try {
        const access_token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');

        if (!access_token) {
          console.error('Logout failed: Access token not found.');
          return;
        }
        const headers = {
          Authorization: `Bearer ${access_token}`,
        };

        // Send a POST request to the 'logout' endpoint using Axios (or any HTTP client of your choice)
        const response = await this.$http.post('logout', null, { headers });
        if (response.status === 200) {
          // Clear both sessionStorage and localStorage
          sessionStorage.clear();
          localStorage.clear();
          this.$router.push('/');
          window.location.reload();
        } else {
          console.log('Logout failed: Unexpected response status.');
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
  },
};
</script>



