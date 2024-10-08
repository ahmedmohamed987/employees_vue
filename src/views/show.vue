<template>
  <div class="container mt-5">
    <h2 class="text-center mb-4">Employee Details</h2>
    <div v-if="employee">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Nationality</th>
            <th>Religion</th>
            <th>Position</th>
            <th>signature</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ employee.id }}</td>
            <td>{{ employee.employee_name }}</td>
            <td>{{ employee.department['name'] }}</td>
            <td>{{ employee.nationality['name'] }}</td>
            <td>{{ employee.religion['name'] }}</td>
            <td>{{ employee.position['title'] }}</td>
            <td>
              <div class="signature-container">
                <img v-if="employee.employee_signature"
                  :src="`http://localhost:8000/storage/${employee.employee_signature}`" alt="Employee Signature"
                  class="signature-image" />
                <span v-else>No Signature Available</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>



<script>
import axios from "../axios";

export default {
  data() {
    return {
      employee: null,
    };
  },
  created() {
    this.fetchEmployee();
  },
  methods: {
    async fetchEmployee() {
      const employeeId = this.$route.params.id;

      try {
        const response = await axios.get(`/employees/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.employee = response.data;
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    },
  },
};
</script>
<style>
.signature-container {
  text-align: left;
}

.signature-image {
  width: 60px;
  height: 80px;
  border: 2px solid #007bff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>