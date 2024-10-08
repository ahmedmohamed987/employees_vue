<template>
  <div id="app">
    <Header />
    <router-view />

    
  </div>
</template>

<script>
import Header from './views/header.vue';

export default {
  components: {
    Header,
    
  },
 
};
</script>

