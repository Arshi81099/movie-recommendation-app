<template>
    <div class="csv-export-container">
      <h4 class="title">Enter the codes of the theatres whose data you want to export as comma-separated values.</h4>
      <input v-model="theatreCodesInput" type="text" placeholder="Theatre Codes (Ex: A,B,C)" />
      <button @click="fetchDataAndConvertToCSV">Export CSV Data</button>
  
      <div v-if="isDataReady" class="download-container">
        <p class="message">Data is ready for download!</p>
        <a :href="downloadURL" download="data.csv" class="download-link">Download CSV</a>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        theatreCodesInput: null,
        jsonData: null,
        isDataReady: false,
        downloadURL: '',
      };
    },
    methods: {
    async fetchDataAndConvertToCSV() {
      const access_token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
      const headers = {
        Authorization: `Bearer ${access_token}`,
      };
      try {
        const response = await this.$http.get('exportcsv', {
          params: {
            code: this.theatreCodesInput,
          },
          headers: headers,
        });


        this.jsonData = response.data;
        // console.log(this.jsonData)


        if (this.jsonData) {
          const csvData = this.convertToCSV(this.jsonData);
          this.downloadURL = this.createDownloadLink(csvData, 'data.csv');
          this.isDataReady = true;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    },
    convertToCSV(jsonData) {


      const csvLines = [];


      const keys1 = Object.keys(jsonData[0]);
      csvLines.push(keys1.join(','));


      const values1 = keys1.map(key => jsonData[0][key]);
      csvLines.push(values1.join(','));


      const desiredOrderKeys = [
        "id",
        "name",
        "genre",
        "time",
        "rating",
        "start_date",
        "end_date",
        "ticket_price",
        "theatre_code",
        "bookings"
      ];
      csvLines.push(desiredOrderKeys.join(','));


      for (let i = 1; i < jsonData.length; i++) {
        const values2 = desiredOrderKeys.map(key => {
          if (key.includes('date')) {
            return this.formatDate(jsonData[i][key]);
          }
          return jsonData[i][key];
        });
        csvLines.push(values2.join(','));
      }


      return csvLines.join('\n');
    },
    createDownloadLink(csvData, filename) {
      const blob = new Blob([csvData], { type: 'text/csv' });
      return URL.createObjectURL(blob);
    },
  },
  };
  </script>
  
  