import './assets/main.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'vue-loading-overlay/dist/css/index.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {LoadingPlugin} from 'vue-loading-overlay';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(LoadingPlugin);

app.mount('#app')