<template>
  <div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-md-4">
        <h2 class="text-center">Login</h2>
        <form @submit.prevent="login">
          <div class="form-floating mb-3">
            <input type="email" v-model="email" class="form-control" id="floatingInput" placeholder="name@example.com"
              required>
            <label for="floatingInput">Email address</label>
          </div>
          <div class="form-floating mb-3">
            <input type="password" v-model="password" class="form-control" id="floatingPassword" placeholder="Password"
              required>
            <label for="floatingPassword">Password</label>
          </div>
          <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
        <p class="mt-3 text-center">
          Don't have an account?
          <router-link to="/register">Register</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../axios";
import { EventBus } from "../eventBus";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {

    async login() {
      try {
        const response = await axios.post('/login', {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        EventBus.emit('authChanged', true);
        
        // console.log(response.data);
        this.$router.push({name : 'index'});

        // this.$router.push(`/chat/${response.data.user.id}`); // Navigate to a protected route after login
      } catch (error) {
        console.error('Login failed:', error);
      }
    },

   
  },
};
</script>
