<template>
    <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="text-center">Register</h2>
        <form @submit.prevent="register">
        <div class="form-floating mb-3">
            <input type="text" v-model="name" class="form-control" id="floatingInput" placeholder="" required>
            <label for="floatingInput">Name</label>
        </div>
          <div class="form-floating mb-3">
            <input type="email" v-model="email" class="form-control" id="floatingInput" placeholder="name@example.com" required>
            <label for="floatingInput">Email address</label>
         </div>
         <div class="form-floating mb-3">
            <input type="password" v-model="password" class="form-control" id="floatingPassword" placeholder="Password" required>
            <label for="floatingPassword">Password</label>
        </div>
        <div class="form-floating mb-3">
            <input type="password" v-model="password_confirmation" class="form-control" id="floatingPassword" placeholder="Password" required>
            <label for="floatingPassword">Password Confirmation</label>
        </div>
          <button type="submit" class="btn btn-primary btn-block ">Register</button>
        </form>
        <p class="mt-3 text-center">
          You have an account?
          <router-link to="/">Login</router-link>
        </p>
      </div>
    </div>
  </div>
  </template>
  
<script>
import axios from '../axios';

export default {
  data() {
    return {
      name: '',                  
      email: '',                  
      password: '',              
      password_confirmation: '',  
    };
  },
  methods: {
    async register() {
     
      if (this.password !== this.password_confirmation) {
        console.error('Passwords do not match');
        return;  
      }

      try {
        const response = await axios.post('/register', {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation,  
        });


        this.$router.push({ name: 'login' });

      } catch (error) {
        console.error('Registration failed:', error.response ? error.response.data : error.message);
      }
    },
  },
};
</script>
  
