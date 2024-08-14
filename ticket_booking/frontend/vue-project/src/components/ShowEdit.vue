<template>
  <div class="edit-show-container">
    <h2>Edit Show Details</h2>
    <form @submit.prevent="editShow" enctype="multipart/form-data">
      <div class="form-group">
        <label for="name">Name:</label>
        <input v-model="name" type="text" id="name">
      </div>
      <div class="form-group">
        <label for="genre">Genre:</label>
        <input v-model="genre" type="text" id="genre">
      </div>
      <div class="form-group">
        <label for="tag">Tag:</label>
        <input v-model="tag" type="text" id="tag">
      </div>
      <!-- <div class="form-group">
          <label for="theatre">Theatre Code:</label>
          <input v-model="code" type="integer" id="code" required>
        </div> -->
      <div class="form-group">
        <label for="ticke_price">Ticket Price:</label>
        <input v-model="ticket_price" type="integer" id="ticket_price">
      </div>
      <div class="form-group">
        <label for="startdate">Start Date:</label>
        <input v-model="startdate" type="date" id="startdate">
      </div>
      <div class="form-group">
        <label for="enddate">End Date:</label>
        <input v-model="enddate" type="date" id="enddate">
      </div>
      <div class="form-group">
        <label for="time">Time:</label>
        <input v-model="time" type="time" id="time">
      </div>
      <!-- Image Field -->
      <div class="form-group">
        <label for="image">Image:</label>
        <input type="file" accept="image/*" @change="handleImageChange" id="image">
        <!-- Image Preview -->
        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" alt="Selected Image Preview">
        </div>
      </div>
      <button type="submit">Save</button>
    </form>
  </div>
</template>
  
<script>
export default {
  props: ["code"],
  data() {
    return {
      name: '',
      genre: '',
      tag: '',
      // t_code: '',
      startdate: '',
      enddate: '',
      time: '',
      ticket_price: '',

      imageFile: null,
      imagePreview: null,
    };
  },
  methods: {
    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageFile = file;
        this.imagePreview = URL.createObjectURL(file);
      } else {
        this.imageFile = null;
        this.imagePreview = null;
      }
    },
    async editShow() {
      try {
        const access_token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
        const code = this.$route.query.code
        const showData = new FormData();
        showData.append('name', this.name);
        showData.append('genre', this.genre);
        showData.append('tag', this.tag);
        showData.append('time', this.time);
        showData.append('rating', this.rating);
        showData.append('start_date', this.startdate);
        showData.append('end_date', this.enddate);
        showData.append('ticket_price', this.ticket_price);
        showData.append('theatre_code', code);
        showData.append('img', this.imageFile);
        // console.log(showData)
        const id = this.$route.params.showId


        const response = await this.$http.put(`show/${id}`, showData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${access_token}`,
          },
        },);

        if (response.status === 201) {

          console.log("Show added successfully!", code);
          this.$router.push(`/theatres/${code}`);
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

  