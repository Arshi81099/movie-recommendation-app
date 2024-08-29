<template>
  <div class="container mt-4">
    <div class="row">
      <!-- Show Details Card -->
      <div class="col-md-6">
        <div class="card mb-4">
          <img :src="getShowImage(Show.img)" alt="Movie Poster" class="card-img-top">
          <div class="card-body">
            <h3 class="card-title">{{ Show.name }}</h3>
            <p class="card-text"><strong>Genre:</strong> {{ Show.genre }}</p>
            <p class="card-text"><strong>Tag:</strong> {{ Show.tags }}</p>
            <p class="card-text"><strong>Start Date:</strong> {{ Show.start_date.slice(0, 16) }}</p>
            <p class="card-text"><strong>End Date:</strong> {{ Show.end_date.slice(0, 16) }}</p>
            <p class="card-text"><strong>Ticket Price:</strong> Rs. {{ Show.ticket_price }}</p>
            <p class="card-text"><strong>Theatre Code:</strong> {{ Show.theatre_code }}</p>
            <p class="card-text"><strong>Available Seats:</strong> {{ Show.available_seats }}</p>
            <p class="card-text"><strong>Time:</strong> {{ Show.time }}</p>
            <button class="btn btn-primary" @click="handleBookNow">Book</button>
          </div>
        </div>
      </div>

      <!-- Reviews Card -->
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-body">
            <h4 class="card-title">Reviews</h4>
            <div v-if="reviews.length === 0" class="alert alert-info">No reviews yet.</div>
            <ul class="list-group">
              <li v-for="review in paginatedReviews" :key="review.id" class="list-group-item" :class="{'text-success': review.review_score === 1, 'text-danger': review.review_score === 0}">
                <p><strong>{{ review.user_id }}</strong></p>
                <p><strong>Comment:</strong> {{ review.comment }}</p>
                <p><strong>Review Score:</strong> {{ review.review_score === 1 ? 'Positive' : 'Negative' }}</p>
              </li>
            </ul>

            <!-- Pagination Controls -->
            <nav aria-label="Page navigation">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
                </li>
                <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                  <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
                </li>
              </ul>
            </nav>
            <h4 class="card-title">Submit Your Review</h4>
            <form @submit.prevent="submitReview">
              <div class="mb-3">
                <label for="reviewText" class="form-control list-group-item">Your Review</label>
                <textarea v-model="newReview.comment" id="reviewText" class="form-control" rows="3" required></textarea>
              </div>
              <div class="mb-3">
                <label for="reviewRating" class="form-control list-group-item">Rating (out of 100)</label>
                <input v-model.number="newReview.rating" type="number" id="reviewRating" class="form-control" min="0" max="100" required>
              </div>
              <button type="submit" class="btn btn-primary">Submit Review</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.list-group-item {
  padding: 0.5rem; /* Reduce padding to decrease height */
  margin-bottom: 0.5rem; /* Optional: reduce bottom margin */
  line-height: 1.2; /* Optional: adjust line height for compactness */
}
.list-group-item p {
  margin: 0; /* Remove default margin for paragraphs inside list items */
}
</style>


<script>
export default {
  data() {
    return {
      Show: null,
      code: '',
      availableSeats: '',
      imageFile: null,
      imagePreview: null,
      capacity: '',
      isLoggedIn: false,
      reviews: [],
      currentPage: 1,
      reviewsPerPage: 4, // Number of reviews per page
      newReview: {
        comment: '',
        rating: 0,
      }
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.reviews.length / this.reviewsPerPage);
    },
    paginatedReviews() {
      const start = (this.currentPage - 1) * this.reviewsPerPage;
      const end = start + this.reviewsPerPage;
      return this.reviews.slice(start, end);
    }
  },
  mounted() {
    this.fetchShow();
    this.checkLoginStatus();
  },
  methods: {
    async handleBookNow() {
      if (this.isLoggedIn) {
        this.bookNow(this.Show.id);
      } else {
        this.$router.push({ name: 'login' });
      }
    },

    bookNow(showId) {
      const theatreCode = this.Show.theatre_code;
      this.$router.push({
        name: 'bookshow',
        params: { showId: showId },
        query: { availableSeats: this.availableSeats, code: theatreCode }
      });
    },

    getShowImage(encodedString) {
      return "data:image/png;base64," + encodedString;
    },

    async fetchShow() {
      try {
        const showId = this.$route.params.showId;
        const capacity = Number(this.$route.query.capacity);
        const code = this.$route.query.code;
        this.capacity = capacity;
        this.code = code;

        // Fetch show details
        const response = await this.$http.get(`show/${showId}`);
        this.Show = response.data;
        this.availableSeats = capacity - Number(this.Show.bookings || 0);

        // Fetch reviews for the show
        const reviewsResponse = await this.$http.get(`review/${showId}`);
        this.reviews = reviewsResponse.data;
      } catch (error) {
        console.error('Error fetching theatre or reviews:', error);
      }
    },

    async submitReview() {
      if (!this.isLoggedIn) {
        this.$router.push({ name: 'login' });
        return;
      }

      try {
        const showId = this.Show.id;
        console.log(sessionStorage)
        const userId = sessionStorage.getItem('email') || localStorage.getItem('email');
        const reviewData = {
          show_id: showId,
          email: userId, 
          rating: this.newReview.rating,
          comment: this.newReview.comment
        };

        console.log('Review data:', reviewData);
        
        // Post review data
        await this.$http.post('review', reviewData);
        
        // Refresh reviews after submission
        await this.fetchShow();
        this.newReview = { comment: '', rating: 0 }; // Clear form
      } catch (error) {
        console.error('Error submitting review:', error);
      }
    },

    checkLoginStatus() {
      this.isLoggedIn = !!(sessionStorage.getItem('access_token') || localStorage.getItem('access_token'));
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  },
};
</script>

