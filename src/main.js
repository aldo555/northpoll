import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueTextareaAutosize from 'vue-textarea-autosize'
import Notifications from 'vue-notification'
import './assets/tailwind.css'

Vue.config.productionTip = false

Vue.use(VueTextareaAutosize)
Vue.use(Notifications)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
