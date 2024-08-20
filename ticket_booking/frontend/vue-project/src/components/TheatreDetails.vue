<template>
  <div class="theatre-details">
    <div class="detail-card">
      <div class="detail-item">
        <span class="label">Name:</span>
        <span>{{ theatre.name }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Address:</span>
        <span>{{ theatre.address }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Code:</span>
        <span>{{ theatre.code }}</span>
      </div>
      <div class="detail-item">
        <span class="label">ID:</span>
        <span>{{ theatre.id }}</span>
      </div>
    </div>
    <ShowtimeManagement :code="theatre.code" />
  </div>
</template>
  
<script>
import ShowtimeManagement from './ShowtimeManagement.vue';
export default {
  components: {
    ShowtimeManagement
  },
  data() {
    return {
      theatre: null
    }
  },
  created() {

  },
  mounted() {
    const theatreCode = this.$route.params.theatreCode;
    this.fetchTheatre()

  },

  methods: {
    async fetchTheatre() {
      try {
        const theatreCode = this.$route.params.theatreCode;
        const response = await this.$http.get(`theatre/${theatreCode}`);
        this.theatre = response.data;
      } catch (error) {
        console.error('Error fetching theatre:', error);
      }
    },
  },
};
</script>
  