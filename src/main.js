import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import VueSignaturePad from 'vue-signature-pad';

const app = createApp(App);

app.use(router);
app.use(VueSignaturePad); 

app.mount('#app');

