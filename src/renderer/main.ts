import {createApp} from 'vue'
import './styles/style.css'
import App from './App.vue'
import {router} from "@/renderer/router/router.ts";

createApp(App)
  .use(router)
  .mount('#app')