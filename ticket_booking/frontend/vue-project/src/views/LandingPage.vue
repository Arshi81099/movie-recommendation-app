<template>
  <div class="landing-page h-100">
    <header class="w-100">
      <nav>
      </nav>
    </header>
    <h1 class="head">Welcome to Movie Ticket Booking</h1>
    <ImageSlider />
    <!-- Hero section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="head">Trending Shows</h1>
        <!-- <router-link to="/movies" class="btn btn-primary">Explore Movies</router-link> -->
        <ssr-carousel :slides-per-page="1" center loop show-dots :autoplayDelay="1" class="d" :gutter='40'>

          <div v-for="show in trendingShows" :key="show.id">
            <div class="slide bg-cover" :title="`Show name: ${show.name}`">
              <img :src="getShowImage(show.img)" />
            </div>
          </div>
          <div class="slide bg-cover">
            <img src="../assets/movie1.jpeg" />
          </div>
        </ssr-carousel>
      </div>
    </section>
  </div>
</template>
  
<script>
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import ImageSlider from '../components/ImageSlider.vue';
import NavBar from '../components/NavBar.vue';


export default {
  name: 'LandingPage',
  components: {
    BootstrapVue,
    ImageSlider,
    NavBar,
  },
  mounted() {
    this.fetchTrendingShows()
  },
  methods: {
    getShowImage(encodedString) {
      return "data:image/png;base64," + encodedString;
    },
    async fetchTrendingShows() {
      try {
        const response = await this.$http.get('trending');
        this.trendingShows = response.data;


      } catch (error) {
        console.error('Error fetching trending:', error);
      }
    },
  },
  data() {
    return {
      trendingShows: null,
      featuredMovies: [
        {
          id: 1,
          title: "Movie 1",
          genre: "Action",
          poster: "../assets/movie1.jpeg",
        },
        // Add more featured movies here
      ],
      upcomingEvents: [
        {
          id: 1,
          title: "Event 1",
          date: "2023-07-31",
          image: "../assets/movie2.jpeg",
        },
        // Add more upcoming events here
      ],
      searchQuery: '',
      selectedGenre: null,
      featuredMovies: [
        // Featured movies data (same as before)
      ],
      upcomingEvents: [
        // Upcoming events data (same as before)
      ],
      genres: [
        'Action',
        'Comedy',
        'Drama',
        'Sci-Fi',
        // Add more genres as needed
      ],
    };
  },
};
</script>
  
