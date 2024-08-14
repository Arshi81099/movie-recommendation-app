
<template>
    <div>
        <button class="btn w-max-24 mt-2 btn btn-primary view-button" @click="showForm = true">Generate Your Booking History
            Report</button>
        <div v-if="showForm" class="mt-4">
            <div class="text-right">
                <label>Select Report Format:</label>
                <select v-model="selectedFormat">
                    <option value="pdf">PDF</option>
                </select>
                <button @click="generateReport">Generate</button>
                <button @click="showForm = false">Cancel</button>
            </div>
        </div>
    </div>
</template>
 
<script>
//@ts-ignore
import html2pdf from 'html2pdf.js';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

// import html2pdf from 'html2pdf.js/dist/html2pdf.js';

export default {
    data() {
        return {
            html: null,
            report: null,
            showForm: false,
            selectedFormat: 'html',
            showDeleteConfirmation: false,
            task_id: '',
        }
    },
    methods: {
        async generateReport() {
            try {
                const access_token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
                const headers = {
                    Authorization: `Bearer ${access_token}`,
                };
                const response = await this.$http.post('report', {}, { headers: headers });
                if (response.status === 202) {
                    this.task_id = response.data.task_id;
                    // console.log(this.task_id)
                    setTimeout(() => this.fetchReportStatus(this.task_id), 500);
                }
            } catch (error) {
                console.error('Error fetching report:', error);
            }
        },
        async fetchReportStatus(task_id) {
            try {
                const access_token = sessionStorage.getItem('access_token') || localStorage.getItem('access_token');
                const headers = {
                    Authorization: `Bearer ${access_token}`,
                };
                const response = await this.$http.get(`report/${task_id}`, { headers });
                const status = response.data.status;

                console.log(status)
                if (status === 'pending') {
                    // console.log(response.data)
                    setTimeout(() => this.fetchReportStatus(task_id), 200);
                    // console.log("arshi")
                } else if (status === 'success') {
                    if (this.selectedFormat === 'pdf') {
                        this.html = response.data.url;
                        // console.log(response.data)
                        this.downloadPDF(this.html);
                    }
                } else {

                    console.error('Report status is not "pending" or "success":', status);
                }
            } catch (error) {
                console.error('Error fetching report status:', error);
            }
        },
        async convertToPDF(html) {
      const content = html;
      const doc = new jsPDF();
      const options = {
        margin: { top: 20, bottom: 20 }, // Optional margins
        filename: 'report.pdf', // Optional filename
      };

      // Create PDF
    //   doc.fromHTML(content, options.margin.top, options.margin.top, {
    //     width: 180,
    //   });

      await doc.html(content, {
        callback: function (pdf) {
          pdf.save(options.filename);
        },
        x: options.margin.top,
        y: options.margin.top,
      });

      // Save the PDF
      doc.save(options.filename);
    },
        downloadPDF(html) {
            const content = html;
            const options = {
                margin: [15, 15, 15, 15], 
                filename: 'report.pdf', 
                image: { type: 'jpeg', quality: 0.98 }, 
                html2canvas: { scale: 2 }, 
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, 
            };
            html2pdf().from(content).set(options).save();
    },
},
};
</script>