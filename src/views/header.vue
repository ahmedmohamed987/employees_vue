<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">MyApp</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item" v-if="isAuthenticated">
              <router-link class="nav-link" to="/index">Home</router-link>
            </li>
            <li class="nav-item" v-if="isAuthenticated">
              <router-link @click="logout" class="nav-link" to="/">Logout</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import axios from "../axios";
import { EventBus } from "../eventBus";
export default {
  name: 'Header',
  data() {
    return {
      isAuthenticated: false,
    };
  },
  created() {
    this.checkAuth();
    EventBus.on('authChanged', (isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
  },
  methods: {
    checkAuth() {
      this.isAuthenticated = !!localStorage.getItem('token');
    },
    async logout() {
      try {
        const response = await axios.post('/logout', {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];

        EventBus.emit('authChanged', false);

        this.$router.push('/');
      } catch (error) {
        console.error('Logout failed', error);
      }
    }

  },
};

</script>

<style scoped>
.navbar {
  margin-bottom: 20px;
}
</style>