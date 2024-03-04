import {createApp} from 'vue'
import './style.css';
import App from './App.vue'
import {router} from "@/router";
import useGlobalStyles from './style';

useGlobalStyles();

createApp(App)
  .use(router)
  .mount('#app')