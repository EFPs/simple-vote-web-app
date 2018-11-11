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


console.log("WAAFCJSDNVADNFBNDFBB")


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// firebase.auth().signInAnonymously().catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   console.log("err login ",error)
// });
//
// const unsubscribe = firebase.auth()
//
//   .onAuthStateChanged((firebaseUser) => {
//
//     new Vue({
//       el: '#app',
//       router,
//       store,
//       render: h => h(App),
//       created () {
//
//
//         if (firebaseUser) {
//           store.dispatch('autoSignIn', firebaseUser)
//         }else{
//           router.push('/')
//         }
//       }
//     })
//     unsubscribe()
//   })



