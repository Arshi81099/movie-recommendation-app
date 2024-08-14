<template>
    <div class="movie-list">
      <h2>Available Movies</h2>
      <div v-if="movies.length === 0">No movies found.</div>
      <div v-else>
        <div v-for="movie in movies" :key="movie.id" class="movie-card">
          <h3>{{ movie.title }}</h3>
          <p>Genre: {{ movie.genre }}</p>
          <!-- Add any other movie details you want to display -->
          <router-link :to="{ name: 'MovieDetails', params: { id: movie.id } }">View Details</router-link>
        </div>
      </div>
    </div>
  </template>
  
<script>
export default {
  name: 'MovieList',
  data() {
    return {
      movies: [
        // Replace this with the actual movie data fetched from your API
        { id: 1, title: 'Movie 1', genre: 'Action' },
        { id: 2, title: 'Movie 2', genre: 'Comedy' },
        { id: 3, title: 'Movie 3', genre: 'Drama' },
        // Add more movie objects as needed
      ],
    };
  },
};
</script>
  
  