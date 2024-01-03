/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
// Components
import App from './App.vue'
import 'vuetify/dist/vuetify.min.css';
// Composables
import { createApp } from 'vue'
import api from './services/api'
import vuetifyInstance from './plugins/vuetify' 
import VueChatScroll from 'vue3-chat-scroll-next'
import {Vuetify3Dialog} from 'vuetify3-dialog'
const app = createApp(App)
registerPlugins(app)
app.use(Vuetify3Dialog, {
  vuetify: vuetifyInstance, //You must pass your vuetify instance as an option
    defaults: {
      //You can pass default options for dialogs, dialog's card, snackbars or bottom-sheets here
    }
  })
app.use(VueChatScroll)
app.config.globalProperties.$api = api;
app.mount('#app')
