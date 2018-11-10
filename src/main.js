import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from './firebase'
import VueFire from 'vuefire'
// import Buefy from 'buefy'
// import 'buefy/dist/buefy.css'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader



// Vue.use(Buefy)
Vue.use(Vuetify)
Vue.use(VueFire);




Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



