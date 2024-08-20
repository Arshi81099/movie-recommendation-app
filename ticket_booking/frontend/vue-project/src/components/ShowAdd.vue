<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="saveShow" enctype="multipart/form-data">
      <h2>Add Show Details</h2>
      <div class="form-group">
        <label for="name">Name:</label>
        <input v-model="name" type="text" id="name" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="genre">Genre:</label>
        <input v-model="genre" type="text" id="genre" class="form-control" required>
      </div>

      <div class="row">
      <div class="col">
      <div class="form-group">
        <label for="tags">Tag:</label>
        <input v-model="tags" type="text" id="tags" class="form-control" required>
      </div>
      </div>
      <div class="col">
      <div class="form-group">
      <label for="capacity">Capacity:</label>
      <input v-model="capacity" type="number" id="capacity" class="form-control" required>
    </div>
    </div>
      </div>

  <div class="row">
  <div class="col">
    <div class="form-group">
      <label for="code">Theatre Code:</label>
      <input v-model="code" type="number" id="code" class="form-control" required>
    </div>
  </div>
  <div class="col">
    <div class="form-group">
      <label for="ticket_price">Ticket Price:</label>
      <input v-model="ticket_price" type="number" id="ticket_price" class="form-control" required>
    </div>
  </div>
</div>

  <div class="row">
  <div class="col">
    <div class="form-group">
      <label for="startdate">Start Date:</label>
      <input v-model="startdate" type="date" id="startdate" class="form-control" required>
    </div>
  </div>
  <div class="col">
    <div class="form-group">
      <label for="enddate">End Date:</label>
      <input v-model="enddate" type="date" id="enddate" class="form-control" required>
    </div>
  </div>
</div>

      <div class="form-group">
        <label for="time">Time:</label>
        <input v-model="time" type="time" id="time" class="form-control" required>
      </div>
      <div class="form-group">
    <label for="image">Image:</label>
    <input type="file" accept="image/*" @change="handleImageChange" class="form-control" id="image">
    <!-- Image Preview -->
    <div v-if="imagePreview" class="image-preview">
      <img :src="imagePreview" alt="Selected Image Preview" class="image-preview-small">
    </div>
  </div>
      <button class="btn btn-primary" type="submit">Save</button>
    </form>
  </div>
</template>
    
<script>
export default {
  data() {
    return {
      name: '',
      genre: '',
      tags: '',
      code: '',
      startdate: '',
      enddate: '',
      time: '',
      ticket_price: '',
      capacity: '',

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
    async saveShow() {
      try {
        const access_token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');

        const showData = new FormData();
        showData.append('name', this.name);
        showData.append('genre', this.genre);
        showData.append('tags', this.tags);
        showData.append('time', this.time);
        showData.append('rating', this.rating);
        showData.append('start_date', this.startdate);
        showData.append('end_date', this.enddate);
        showData.append('ticket_price', this.ticket_price);
        showData.append('theatre_code', this.code);
        showData.append('capacity', this.capacity);
        showData.append('img', this.imageFile);
        // console.log(showData)
        const response = await this.$http.post("show", showData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${access_token}`,
          },
        },);

        if (response.status === 201) {
          window.alert("Show added successfully!");
          this.$router.push("/theatremanagement");
          this.shouldReloadPage = true;
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
    