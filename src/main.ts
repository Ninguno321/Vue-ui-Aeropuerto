import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia'


import './assets/tablas.css'

const pinia = createPinia()
const app = createApp(App);
app.use(router)

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            // Force light mode: dark scheme activates only if this selector exists.
            darkModeSelector: '.umu-dark'
        }
    }
});
app.use(pinia)
app.mount('#app')
