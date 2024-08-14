<template>
    <div class="search-page">
        <h2>Search List</h2>
        <div v-if="searchResults.length === 0" class="text-center">
            No results found.
        </div>
        <div v-else>
            <div v-for="item in searchResults.theatres" :key="item.id" class="search-item">
                <h2> Theatre </h2>
                <h3>{{ item.name }}</h3>
                <p>Location: {{ item.address }}</p>
                <button class="w-max-24 btn-primary" @click="viewTheatre(item.code)">View</button>
            </div>

            <div v-for="item in searchResults.shows" :key="item.id" class="search-item">
                <h2> Show </h2>
                <h3>{{ item.name }}</h3>
                <p>Date:- From {{ item.start_date.slice(0, 16) }} to {{ item.end_date.slice(0, 16) }}</p>
                <button class="w-max-24 btn  m-2" @click="viewShow(item)">View</button>

            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            searchResults: [],
            searchQuery: null,

        };
    },
    watch: {
        '$route': {
            immediate: true,
            handler(to, from) {
                if (to.query.searchQuery !== from.query.searchQuery) {
                    this.searchItems();
                }
            },
        },
    },
    mounted() {
        this.searchItems()
    },
    methods: {
        viewShow(item) {
            const showId = item.id;
            const capacity = item.capacity;
            const code = item.theatre_code
            this.$router.push({ path: `/moviedetails/${showId}`, query: { capacity: capacity, code: code } });
        },
        viewTheatre(theatreCode) {
            this.$router.push(`/theatres/${theatreCode}`);
        },
        async searchItems() {
            const searchQuery = this.$route.query.searchQuery;
            // this.searchQuery = searchQuery;
            this.searchQuery = null;
            try {
                const response = await this.$http.get(`search/${searchQuery}`);
                this.searchResults = response.data;
                this.searchQuery = null;
            } catch (error) {
                console.error('Error fetching results of search:', error);
            }
        },
    },
};
</script>

  