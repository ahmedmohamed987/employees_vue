<template>
    <div class="container mt-5">
      <h2>Employee List</h2>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>department</th>
           <th>opreations</th>
           
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employees" :key="employee.id">
            <td>{{ employee.id }}</td>
            <td>{{ employee.employee_name }}</td>
            <td>{{ employee.department_name }}</td>
            <td>
                <router-link :to="`/employees/${employee.id}`" class="btn btn-primary m-1" role="button">Show Data</router-link>
                <router-link :to="`/edit/${employee.id}`" class="btn btn-secondary m-1" role="button">Edit</router-link>
                <router-link :to="'/index'" @click.prevent="confirmDelete(employee.id)" class="btn btn-danger m-1">Delete</router-link>
             </td>
          </tr>
        </tbody>
      </table>
    
    <div>
        <router-link to="/create" class="btn btn-primary" role="button">Add Employee</router-link>
     </div>
  </div>
  </template>
  <script>
 import axios from "../axios";
  
  export default {
    data() {
      return {
        employees: [], 
        employee: Object, // Pass the employee data as a prop

      };
    },
    created() {
      this.fetchEmployees(); 
    },
    methods: {
      async fetchEmployees() {
        try {
          const response = await axios.get("/employees",{
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
          });
          this.employees = response.data; 
        } catch (error) {
          console.error("Error fetching employees:", error);
        }
        },
        async confirmDelete(employeeId) {
      if (confirm("Are you sure you want to delete this employee?")) {
        this.deleteEmployee(employeeId);
      }
    },

    async deleteEmployee(employeeId) {
      try {
        const response = await axios.delete(`/employees/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        });
        this.fetchEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error.response);
      }

      },
    },
  };
  </script>
  